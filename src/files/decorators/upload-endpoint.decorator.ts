import { applyDecorators, UseInterceptors } from "@nestjs/common"
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express"
import {
  MulterField,
  MulterOptions
} from "@nestjs/platform-express/multer/interfaces/multer-options.interface"

export function FileUploadEndpoint(fieldName: string, options?: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)))
}

export function FilesUploadEndpoint(uploadFields: MulterField[], options?: MulterOptions) {
  return UseInterceptors(FileFieldsInterceptor(uploadFields, options))
}
