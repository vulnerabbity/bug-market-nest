import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets"
import { Request } from "express"
import { Server } from "socket.io"
import { AccessTokenPayload } from "src/auth/authentication/authentication.interface"
import { JwtWebsocketsAuthenticationGuard } from "src/auth/authentication/guards/jwt-ws-authentication.guard"
import { appConfig } from "src/common/config"
import { WSRequest } from "src/common/decorators/ws/ws-request.decorator"
import { ChatPermissionsCheckInput, ChatsService } from "../chats/chats.service"
import { SendChatMessageInput } from "./message.input"
import { ChatMessagesService } from "./messages.service"

@UseGuards(JwtWebsocketsAuthenticationGuard)
@WebSocketGateway(appConfig.websockets.port, {
  cors: { origin: "*" }
})
export class ChatMessagesGateway {
  @WebSocketServer()
  wsServer!: Server

  constructor(private messagesService: ChatMessagesService, private chatsService: ChatsService) {}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("sendMessage")
  async onSendMessage(
    @MessageBody()
    messageInput: SendChatMessageInput,
    @WSRequest() req: Request
  ) {
    const { userId: senderId }: AccessTokenPayload = req.user as AccessTokenPayload
    const { chatId, text } = messageInput

    await this.messagesService.sendMessage({ chatId, userId: senderId, text })
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("markChatViewed")
  async onMarkChatViewed(@WSRequest() req: Request, @MessageBody("chatId") chatId: string) {
    const { userId: viewerId }: AccessTokenPayload = req.user as AccessTokenPayload

    const chat = await this.chatsService.findByIdOrFail(chatId)
    this.failIfViewMessageDenied({ chat, requesterId: viewerId })

    const viewedMessages = await this.messagesService.viewMessages(chat.id, viewerId)

    return viewedMessages
  }

  private failIfViewMessageDenied(input: ChatPermissionsCheckInput) {
    try {
      this.chatsService.failIfManageChatDenied(input)
    } catch (err: any) {
      new WsException(err)
    }
  }
}
