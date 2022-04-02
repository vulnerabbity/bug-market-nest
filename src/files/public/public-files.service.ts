import { Injectable } from "@nestjs/common"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { BaseFileService } from "../base-file.service"
import { PublicFile } from "./public-file.entity"

@Injectable()
export class PublicFilesService extends BaseFileService<PublicFile> {
  timestampKey = "__timestamp="
  constructor(private modelsInjector: ModelsInjectorService) {
    super(modelsInjector.publicFileModel)
  }

  findByUrlOrFail(url: string) {
    return this.findByIdOrFail(url)
  }

  async createUrlForFileId(id: string): Promise<string> {
    const updatedAt = await this.getUpdatedAt(id)
    const timestamp = updatedAt.getTime()
    return `http://localhost:3000/public-files/${id}${this.timestampKey}${timestamp}`
  }

  parseFileIdFromUrl(url: string): string {
    const idWithTimestamp = url.replace("http://localhost:3000/public-files/", "")
    const timestampIndex = idWithTimestamp.indexOf(this.timestampKey)
    const id = idWithTimestamp.slice(0, timestampIndex)
    return id
  }
}
