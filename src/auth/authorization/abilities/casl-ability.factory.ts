import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  AbilityClass
} from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { User, UserRole } from "src/users/user.entity"
import { RolesOwner } from "./abilities.interface"

type Subjects = InferSubjects<typeof User> | "all"

export type Action = "manage" | "create" | "read" | "update" | "delete"

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  constructor() {}
  createForRolesOwner(rolesOwner: RolesOwner) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    )

    const hasRole = this.createRoleChecker(rolesOwner)

    if (hasRole("admin")) {
      can("manage", "all")
    }
    if (hasRole("seller")) {
      can("manage", User, { id: rolesOwner.id }).because("You can only can manage yourself")
    }

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
    })
  }

  private createRoleChecker({ roles }: RolesOwner) {
    return function hasRole(expectedRole: UserRole): boolean {
      return roles.some(role => role === expectedRole)
    }
  }
}
