import { Prop, Schema } from "@nestjs/mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseForeignKeyProp } from "src/common/decorators/mongoose/id-reference.prop"
import { IEntityWithId } from "src/common/interface/entities.interface"

@Schema({
  timestamps: true
})
export class BaseFile implements IEntityWithId {
  @MongooseIdProp()
  id!: string

  @MongooseForeignKeyProp()
  userId!: string

  @Prop({ required: true })
  mimetype!: string

  @Prop({ required: true })
  data!: Buffer

  createdAt!: Date
  updatedAt!: Date
}
