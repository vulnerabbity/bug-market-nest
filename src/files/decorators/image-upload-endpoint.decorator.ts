import {
  MulterField,
  MulterOptions
} from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { multerImageMimetypeFilter } from "../multer/filter.multer"
import { FilesUploadEndpoint, FileUploadEndpoint } from "./upload-endpoint.decorator"

export function ImageUploadEndpoint(fieldName: string, options?: MulterOptions) {
  options = { ...options, fileFilter: multerImageMimetypeFilter }
  return FileUploadEndpoint(fieldName, options)
}

export function ImagesUploadEndpoint(uploadFields: MulterField[], options?: MulterOptions) {
  options = { ...options, fileFilter: multerImageMimetypeFilter }
  return FilesUploadEndpoint(uploadFields)
}
