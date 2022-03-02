import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { BaseFileService } from "../base-file.service"
import { PublicFile, PublicFileModel } from "./public-file.entity"

@Injectable()
export class PublicFilesService extends BaseFileService<PublicFile> {
  constructor(@InjectModel(PublicFile.name) private publicFileModel: PublicFileModel) {
    super(publicFileModel)
  }
}
