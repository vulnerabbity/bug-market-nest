import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"

/**
 * Makes alias to "_id" in entity schema
 */
export function MongooseIdProp(additionalOptions?: PropOptions) {
  const defaultOptions = {
    get: function (this: any) {
      return this._id
    }
  }

  const allOptions = {
    ...(defaultOptions as object),
    ...(additionalOptions as object)
  }

  return applyDecorators(Prop(allOptions))
}
