import { Injectable } from "@nestjs/common"
import { Subject } from "rxjs"
import { Chat } from "../chats/chat.entity"
import { ChatsEventsBus } from "../chats/chats.events-bus"
import { ChatMessage } from "./message.entity"

@Injectable()
export class ChatMessagesEventsBus {
  constructor(private chatsEventsBus: ChatsEventsBus) {
    this.subscribeToChatDelete()
  }

  notViewedChanged$ = new Subject<Chat>()

  messagesUpdated$ = new Subject<{ messages: ChatMessage[]; chatId: string }>()

  messageSended$ = new Subject<{ message: ChatMessage; chat: Chat }>()

  chatDeleted$ = new Subject<Chat>()

  private subscribeToChatDelete() {
    this.chatsEventsBus.chatDeleted$.subscribe(chat => this.chatDeleted$.next(chat))
  }
}
