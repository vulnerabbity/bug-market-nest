import { Length, Matches } from "class-validator"

/**
 * Validates field with regex to match:
 * first lower letter, next lower letters, digits and "._-" chars.
 * Do not validates length
 *
 * @example
 * u-ser.name_1b2
 */
export function Username() {
  return Matches(/^[a-z][a-z0-9[._-]*$/)
}

export function UUID_V4() {
  const uuidV4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  const message = `Id should be in uuid v4 format. Validation regex is ${uuidV4Regex}`
  return Matches(uuidV4Regex, {
    message
  })
}
