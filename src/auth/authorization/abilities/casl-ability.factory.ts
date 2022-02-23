import { InferSubjects, Ability, AbilityBuilder } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { User, UserRole } from "src/users/user.entity"
import { RolesOwner } from "./abilities.interface"

type Subject = InferSubjects<typeof User> | "all"

export type Action = "manage" | "create" | "read" | "update" | "delete"

export type AppAbility = Ability<[Action, Subject]>

@Injectable()
export class CaslAbilityFactory {
  createForRolesOwner(rolesOwner: RolesOwner) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability)

    const hasRole = this.createRoleChecker(rolesOwner)

    return build()
  }

  private createRoleChecker({ roles }: RolesOwner) {
    return function hasRole(expectedRole: UserRole): boolean {
      return roles.some(role => role === expectedRole)
    }
  }
}
