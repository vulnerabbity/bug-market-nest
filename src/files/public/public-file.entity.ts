import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Model, model } from "mongoose"
import { BaseFile } from "../base-file.entity"

export type PublicFileDocument = Document & PublicFile
export type PublicFileModel = Model<PublicFileDocument>

@Schema({
  timestamps: true
})
export class PublicFile extends BaseFile {
  @Prop({
    virtual: true,
    get: function (this: BaseFile) {
      return this.id
    }
  })
  url!: string
}

export const PublicFileSchema = SchemaFactory.createForClass(PublicFile)
export const publicFileModel = model(
  PublicFile.name,
  PublicFileSchema
) as unknown as PublicFileModel
