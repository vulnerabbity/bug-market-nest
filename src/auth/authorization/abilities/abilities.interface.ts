import { UserRole } from "src/users/user.entity"
import { AppAbility } from "./casl-ability.factory"

export interface RolesOwner {
  roles: UserRole[]
}

/**
 * Interface for class-style defining casl.js policy handler
 *
 * @example
 * class CreateUserPolicy implements IClassPolicyHandler {
 *   handle(ability: AppAbility) {
 *      return ability.can("create", User)
 *   }
 * }
 */
export interface IClassPolicyHandler {
  handle(ability: AppAbility): boolean
}

/**
 * Interface for callback-style defining casl.js policy handler
 *
 * @example (ability: AppAbility) => ability.can("create", User)
 */
export type PolicyHandlerCallback = (ability: AppAbility) => boolean

/**
 * Interface for any policy handler definition style
 */
export type PolicyHandler = IClassPolicyHandler | PolicyHandlerCallback
