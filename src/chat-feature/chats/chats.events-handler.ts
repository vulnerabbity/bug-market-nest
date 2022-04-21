import { Injectable } from "@nestjs/common"
import { ChatNotificationsGateway } from "../notifications/notifications.gateway"
import { ChatsEventsBus } from "./chats.events-bus"

@Injectable()
export class ChatsEventsHandler {
  constructor(
    private chatsEventsBus: ChatsEventsBus,
    private chatsNotifications: ChatNotificationsGateway
  ) {
    this.handleAll()
  }

  private handleAll() {
    this.handleChatDeleted()
    this.handleChatCreated()
  }

  private handleChatDeleted() {
    this.chatsEventsBus.chatDeleted$.subscribe(deletedChat => {
      this.chatsNotifications.emitChatDeleted(deletedChat)
    })
  }

  private handleChatCreated() {
    this.chatsEventsBus.chatCreated$.subscribe(createdChat => {
      this.chatsNotifications.emitChatCreated(createdChat)
    })
  }
}
