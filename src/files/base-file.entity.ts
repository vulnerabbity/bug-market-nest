import { Prop, Schema } from "@nestjs/mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseIdReference } from "src/common/decorators/mongoose/id-reference.prop"

@Schema()
export class BaseFile {
  @MongooseIdProp()
  id!: string

  @MongooseIdReference()
  userId!: string

  @Prop({ required: true })
  url!: string

  @Prop({ required: true })
  mimetype!: string

  @Prop({ required: true })
  data!: Buffer
}
