import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"
import { v4 as uuidV4 } from "uuid"

/**
 * Generates immutable UUID for schema field
 */
export function MongooseIdProp(additionalOptions?: PropOptions) {
  const defaultOptions: PropOptions = { unique: true, default: () => uuidV4(), immutable: true }

  const allOptions = {
    ...(defaultOptions as object),
    ...(additionalOptions as object)
  }

  return applyDecorators(Prop(allOptions))
}
