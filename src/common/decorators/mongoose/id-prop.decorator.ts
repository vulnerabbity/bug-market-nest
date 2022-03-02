import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"

/**
 * Makes alias to "_id" for entity field
 */
export function MongooseIdProp(additionalOptions?: PropOptions) {
  const defaultOptions = {
    get: function (this: any) {
      return String(this._id)
    }
  }

  const allOptions = {
    ...(defaultOptions as object),
    ...(additionalOptions as object)
  }

  return applyDecorators(Prop(allOptions))
}
