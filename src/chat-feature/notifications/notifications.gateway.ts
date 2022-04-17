import { Injectable, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from "@nestjs/websockets"
import { Request } from "express"
import { from, interval, map, Observable } from "rxjs"
import { Server, Socket } from "socket.io"
import { AccessTokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtWebsocketsAuthenticationGuard } from "src/auth/authentication/guards/jwt-ws-authentication.guard"
import { appConfig } from "src/common/config"
import { WSRequest } from "src/common/decorators/ws/ws-request.decorator"
import { Chat } from "../chats/chat.entity"
import { ChatsService } from "../chats/chats.service"
import { ChatMessage } from "../messages/message.entity"

@UseGuards(JwtWebsocketsAuthenticationGuard)
@WebSocketGateway(appConfig.websockets.port, {
  cors: { origin: "*" }
})
export class ChatNotificationsGateway {
  @WebSocketServer()
  wsServer!: Server

  constructor(private chatsService: ChatsService) {}

  @SubscribeMessage("listenToChatsNotifications")
  async onJoinChatsNotifications(@ConnectedSocket() client: Socket, @WSRequest() req: Request) {
    const { userId }: AccessTokenPayload = req.user as AccessTokenPayload
    const chatsIds = await this.chatsService.getChatIds(userId)

    client.join(chatsIds)
  }

  emitMessageSended(message: ChatMessage) {
    const room = message.chatId
    this.wsServer.in(room).emit("messageReceived", message)
  }

  emitMessageUpdated(message: ChatMessage) {
    const room = message.chatId
    this.wsServer.in(room).emit("messageUpdated", message)
  }
}
