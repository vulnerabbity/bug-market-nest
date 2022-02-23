import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"
import { SchemaTypes } from "mongoose"
import { User } from "src/users/user.entity"

/**
 * Makes reference to user.id from entity field
 *
 * Entity field should be string
 */
export function MongooseUserIdProp(additionalOptions?: PropOptions) {
  const defaultOptions: PropOptions = {
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name
  }

  const allOptions = { ...(defaultOptions as object), ...(additionalOptions as object) }

  return applyDecorators(Prop(allOptions))
}
