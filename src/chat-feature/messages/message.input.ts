import { IsString } from "class-validator"
import { ChatMessage } from "./message.entity"

export class SendChatMessageInput implements Partial<ChatMessage> {
  @IsString()
  text!: string

  @IsString()
  chatId!: string
}
