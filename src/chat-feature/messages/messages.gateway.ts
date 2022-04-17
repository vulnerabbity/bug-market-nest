import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets"
import { Request } from "express"
import { Server } from "socket.io"
import { AccessTokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtWebsocketsAuthenticationGuard } from "src/auth/authentication/guards/jwt-ws-authentication.guard"
import { appConfig } from "src/common/config"
import { WSRequest } from "src/common/decorators/ws/ws-request.decorator"
import { SendChatMessageInput } from "./message.input"
import { ChatMessagesService } from "./messages.service"

@UseGuards(JwtWebsocketsAuthenticationGuard)
@WebSocketGateway(appConfig.websockets.port, {
  cors: { origin: "*" }
})
export class ChatMessagesGateway {
  @WebSocketServer()
  wsServer!: Server

  constructor(private messagesService: ChatMessagesService) {}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("sendMessage")
  async onSendMessage(
    @MessageBody()
    messageInput: SendChatMessageInput,
    @WSRequest() req: Request
  ) {
    const { userId: senderId }: AccessTokenPayload = req.user as AccessTokenPayload
    const { userId: receiverId, text } = messageInput

    await this.messagesService.sendMessage({ receiverId, senderId, text })
  }
}
