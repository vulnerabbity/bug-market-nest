import { Global, Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Chat, ChatSchema } from "src/chat-feature/chats/chat.entity"
import { ChatMessage, ChatMessageSchema } from "src/chat-feature/messages/message.entity"
import { PublicFile, PublicFileSchema } from "src/files/public/public-file.entity"
import { Product, ProductSchema } from "src/products/product.entity"
import { Session, SessionSchema } from "src/sessions/session.entity"
import { User, UserSchema } from "src/users/user.entity"

const models = [
  MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: PublicFile.name, schema: PublicFileSchema },
    { name: Session.name, schema: SessionSchema },
    { name: Chat.name, schema: ChatSchema },
    { name: ChatMessage.name, schema: ChatMessageSchema }
  ]),
  MongooseModule.forFeatureAsync([{ name: Product.name, useFactory: ProductSchemaSetup }])
]

/**
 * Contains definition of project database models
 */
@Module({
  imports: models,
  exports: models
})
export class ModelsModule {}

function ProductSchemaSetup() {
  const schema = ProductSchema
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  schema.plugin(require("mongoose-fuzzy-searching"), {
    fields: [
      { name: "name", weight: 10 },
      { name: "description", minSize: 4 }
    ]
  })

  return schema
}
