import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseCaslService } from "src/common/service/mongoose-casl.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { ChatMessage } from "./message.entity"

@Injectable()
export class ChatMessagesService extends MongooseService<ChatMessage> {
  constructor(modelsInjector: ModelsInjectorService) {
    super(modelsInjector.chatMessageModel)
  }
}
