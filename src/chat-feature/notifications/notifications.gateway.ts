import { UseGuards } from "@nestjs/common"
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets"
import { Request } from "express"
import { Server, Socket } from "socket.io"
import { AccessTokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtWebsocketsAuthenticationGuard } from "src/auth/authentication/guards/jwt-ws-authentication.guard"
import { appConfig } from "src/common/config"
import { WSRequest } from "src/common/decorators/ws/ws-request.decorator"
import { Chat } from "../chats/chat.entity"
import { ChatMessage } from "../messages/message.entity"

export interface TotalNotViewedMessagesChangedInput {
  number: number
  userId: string
}

export interface NotViewedMessagesChangedPerChatInput extends TotalNotViewedMessagesChangedInput {
  chatId: string
}

interface ConcreteChatNotViewedChangedResponse {
  number: number
  chatId: string
}

@UseGuards(JwtWebsocketsAuthenticationGuard)
@WebSocketGateway(appConfig.websockets.port, {
  cors: { origin: "*" }
})
export class ChatNotificationsGateway {
  @WebSocketServer()
  wsServer!: Server

  @SubscribeMessage("listenToChatsNotifications")
  async onJoinChatsNotifications(@ConnectedSocket() client: Socket, @WSRequest() req: Request) {
    const { userId }: AccessTokenPayload = req.user as AccessTokenPayload

    client.join(userId)
  }

  emitMessageSended(message: ChatMessage, chat: Chat) {
    const room = chat.peersIds
    this.wsServer.in(room).emit("messageReceived", message)
  }

  emitMessageUpdated(message: ChatMessage, chat: Chat) {
    const room = chat.peersIds
    this.wsServer.in(room).emit("messageUpdated", message)
  }

  emitTotalNotViewedMessagesChanged(input: TotalNotViewedMessagesChangedInput) {
    const { number, userId } = input

    const room = userId
    this.wsServer.in(room).emit("totalNotViewedMessagesChanged", number)
  }

  emitConcreteChatNotViewedMessagesChanged(input: NotViewedMessagesChangedPerChatInput) {
    const { number, userId, chatId } = input

    const response: ConcreteChatNotViewedChangedResponse = { number, chatId }
    this.wsServer.in(userId).emit("concreteChatNotViewedMessagesChanged", response)
  }

  emitChatCreated(chat: Chat) {
    const rooms = chat.peersIds
    this.wsServer.in(rooms).emit("chatCreated", chat)
  }

  emitChatDeleted(chat: Chat) {
    const rooms = chat.peersIds
    this.wsServer.in(rooms).emit("chatDeleted", chat)
  }
}
