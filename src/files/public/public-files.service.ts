import { Injectable } from "@nestjs/common"
import { appConfig } from "src/common/config"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { BaseFileService } from "../base-file.service"
import { PublicFile } from "./public-file.entity"

@Injectable()
export class PublicFilesService extends BaseFileService<PublicFile> {
  private readonly hostname = appConfig.core.host
  private readonly timestampKey = "__timestamp="

  constructor(private modelsInjector: ModelsInjectorService) {
    super(modelsInjector.publicFileModel)
  }

  findByUrlOrFail(url: string) {
    return this.findByIdOrFail(url)
  }

  async createUrlForFileId(id: string): Promise<string> {
    const updatedAt = await this.getUpdatedAt(id)
    const timestamp = updatedAt.getTime()
    return `${this.hostname}/public-files/${id}${this.timestampKey}${timestamp}`
  }

  parseFileIdFromUrl(url: string): string {
    const idWithTimestamp = url.replace(`${this.hostname}/public-files/`, "")
    const timestampIndex = idWithTimestamp.indexOf(this.timestampKey)
    const id = idWithTimestamp.slice(0, timestampIndex)
    return id
  }
}
