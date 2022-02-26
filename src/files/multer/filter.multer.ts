import { BadRequestException } from "@nestjs/common"
import { MulterFileFilter } from "./interface.multer"

function makeMulterMimetypeFilter(allowedMimetypes: string[]) {
  const fileFilter: MulterFileFilter = (req, file, callback) => {
    const fileHasAllowedMimetype = isStringInArray(file.mimetype, allowedMimetypes)

    if (fileHasAllowedMimetype) {
      return callback(null, true)
    }

    return callback(
      new BadRequestException(`Invalid mime type. Only allowed: ${allowedMimetypes.join(", ")}`),
      false
    )
  }

  return fileFilter
}

function isStringInArray(candidate: string, array: String[]): boolean {
  return array.some(arrayItem => arrayItem === candidate)
}

const ImageMimetypes = ["image/png", "image/jpg", "image/jpeg"]

/**
 * Filters non images
 */
export const multerImageMimetypeFilter = makeMulterMimetypeFilter(ImageMimetypes)
