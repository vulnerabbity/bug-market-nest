import { Injectable } from "@nestjs/common"
import sharp from "sharp"
import { appConfig } from "src/common/config"

@Injectable()
export class ImageCompressionService {
  private readonly quality = appConfig.compression.imagesQuality

  async compressToWebp(buffer: Buffer): Promise<Buffer> {
    const compressed = await sharp(buffer, { failOnError: false })
      .webp({ quality: this.quality, effort: 0 })
      .toBuffer()

    return compressed
  }
}
