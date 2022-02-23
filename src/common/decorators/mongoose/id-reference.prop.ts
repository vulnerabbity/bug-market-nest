import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"
import { SchemaTypes } from "mongoose"

/**
 * Makes reference to user.id from entity field
 *
 * Entity field should be string
 */
export function MongooseIdReference(additionalOptions?: PropOptions) {
  const defaultOptions: PropOptions = {
    required: true,
    type: SchemaTypes.ObjectId
  }

  const allOptions = { ...(defaultOptions as object), ...(additionalOptions as object) }

  return applyDecorators(Prop(allOptions))
}
