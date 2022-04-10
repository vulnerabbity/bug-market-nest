import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { Chat } from "./chat.entity"

@Injectable()
export class ChatsService extends MongooseService<Chat> {
  constructor(modelsInjector: ModelsInjectorService) {
    super(modelsInjector.chatModel)
  }
}
