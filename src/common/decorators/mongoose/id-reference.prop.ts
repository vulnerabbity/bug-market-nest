import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"

export function MongooseForeignKeyProp(additionalOptions?: PropOptions) {
  const defaultOptions: PropOptions = {
    required: true,
    type: String,
    index: true
  }

  const allOptions = { ...(defaultOptions as object), ...(additionalOptions as object) }

  return applyDecorators(Prop(allOptions))
}
