import { Injectable } from "@nestjs/common"
import { Chat } from "../chats/chat.entity"
import { ChatsService } from "../chats/chats.service"
import { ChatNotificationsGateway } from "../notifications/notifications.gateway"
import { ChatMessage } from "./message.entity"
import { ChatMessagesEventsBus } from "./messages.events-bus"
import { ChatMessagesService } from "./messages.service"

@Injectable()
export class ChatMessagesEventsBusHandler {
  constructor(
    private chatsNotifications: ChatNotificationsGateway,
    private chatsService: ChatsService,
    private messagesService: ChatMessagesService,
    private messagesEventsBus: ChatMessagesEventsBus
  ) {
    this.handleAll()
  }

  private handleAll() {
    this.handleUpdate()
    this.handleMessageSended()
    this.handleNotViewedChanged()
    this.handleChatDeleted()
  }

  private handleUpdate() {
    return this.messagesEventsBus.messagesUpdated$.subscribe(({ chatId, messages }) => {
      this.emitMessagesUpdated(messages, chatId)
    })
  }

  private handleMessageSended() {
    return this.messagesEventsBus.messageSended$.subscribe(({ chat, message }) => {
      this.chatsNotifications.emitMessageSended(message, chat)
    })
  }

  private handleNotViewedChanged() {
    return this.messagesEventsBus.notViewedChanged$.subscribe(chat => {
      this.emitNotViewedChanged(chat)
    })
  }

  private handleChatDeleted() {
    return this.messagesEventsBus.chatDeleted$.subscribe(async chat => {
      await this.messagesService.deleteMany({ chatId: chat.id })
      await this.emitNotViewedChanged(chat)
    })
  }

  private async emitNotViewedChanged(chat: Chat) {
    const { peersIds, id: chatId } = chat
    // TODO: Split into chunks

    for (let peerId of peersIds) {
      const totalNotViewedNumber = await this.messagesService.getTotalNotViewedNumber(peerId)
      this.chatsNotifications.emitTotalNotViewedMessagesChanged({
        number: totalNotViewedNumber,
        userId: peerId
      })

      const notViewedPerChat = await this.messagesService.getNotViewedNumberPerChat({
        chatId,
        viewerId: peerId
      })
      this.chatsNotifications.emitConcreteChatNotViewedMessagesChanged({
        chatId,
        userId: peerId,
        number: notViewedPerChat
      })
    }
  }

  private async emitMessagesUpdated(messages: ChatMessage[], chatId: string) {
    if (messages.length === 0) {
      return
    }
    const chat = await this.chatsService.findByIdOrFail(chatId)

    for (let message of messages) {
      this.chatsNotifications.emitMessageUpdated(message, chat)
    }
  }
}
