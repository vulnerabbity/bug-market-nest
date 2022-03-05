import { Prop, Schema } from "@nestjs/mongoose"
import { ObjectId } from "mongodb"
import { MongooseIdReference } from "src/common/decorators/mongoose/id-reference.prop"

@Schema()
export class BaseFile {
  _id!: ObjectId

  get id() {
    return String(this._id)
  }

  @MongooseIdReference()
  userId!: string

  @Prop({ required: true })
  url!: string

  @Prop({ required: true })
  mimetype!: string

  @Prop({ required: true })
  data!: Buffer
}
