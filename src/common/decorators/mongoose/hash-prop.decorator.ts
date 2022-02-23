import { applyDecorators } from "@nestjs/common"
import { Prop, PropOptions } from "@nestjs/mongoose"
import { hashSync } from "bcrypt"
import { appConfig } from "src/common/config"

/**
 * Hashes field before save in db
 */
export function MongooseHashProp(additionalOptions?: PropOptions) {
  const defaultOptions = {
    set: (plainPassword: string) => {
      const hashedPassword = hashSync(plainPassword, appConfig.security.bcryptSaltFactor)
      return hashedPassword
    }
  }

  const allOptions = {
    ...(defaultOptions as object),
    ...(additionalOptions as object)
  }

  return applyDecorators(Prop(allOptions))
}
