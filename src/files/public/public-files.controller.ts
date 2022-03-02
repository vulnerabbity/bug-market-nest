import { Controller, Get, Param, Res } from "@nestjs/common"
import { Response } from "express"
import { PublicFilesService } from "./public-files.service"

@Controller("public-files")
export class PublicFilesController {
  constructor(private publicFilesService: PublicFilesService) {}

  @Get(":fileUrl")
  public async shareFile(@Param("fileUrl") fileUrl: string, @Res() response: Response) {
    const file = await this.publicFilesService.findByUrl(fileUrl)

    response.contentType(file.mimetype)
    response.send(file.data)
  }
}
