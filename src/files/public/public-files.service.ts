import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { BaseFileService } from "../base-file.service"
import { PublicFile } from "./public-file.entity"

@Injectable()
export class PublicFilesService extends BaseFileService<PublicFile> {
  constructor(private modelsInjector: ModelsInjectorService) {
    super(modelsInjector.publicFileModel)
  }
}
