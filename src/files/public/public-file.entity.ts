import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model } from "mongoose"
import { MongooseIdProp } from "src/common/decorators/mongoose/id-prop.decorator"
import { MongooseIdReference } from "src/common/decorators/mongoose/id-reference.prop"

export type PublicFileDocument = Document & PublicFile
export type PublicFileModel = Model<PublicFileDocument>

export enum PublicFileTypesEnum {
  AVATAR = "avatar"
}

// convert to union type
export type PublicFileType = `${PublicFileTypesEnum}`

@Schema()
export class PublicFile {
  @MongooseIdProp()
  id!: string

  @MongooseIdReference()
  userId!: string

  @Prop({ required: true, enum: PublicFileTypesEnum })
  fileType!: PublicFileType

  @Prop({ required: true })
  mimetype!: string

  @Prop({ required: true })
  content!: Buffer
}

export const PublicFileSchema = SchemaFactory.createForClass(PublicFile)
