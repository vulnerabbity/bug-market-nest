import {
  InferSubjects,
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType
} from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Category } from "src/categories/category.entity"
import { Product, ProductModel } from "src/products/product.entity"
import { User, UserModel } from "src/users/user.entity"
import { UserRole } from "src/users/user.interface"
import { RolesOwner } from "./abilities.interface"

type SubjectsEntities = typeof User | typeof Product | typeof Category
type SubjectsModels = UserModel | ProductModel

export type Subjects = InferSubjects<SubjectsEntities | SubjectsModels | typeof Category> | "all"

export type Action = "manage" | "create" | "read" | "update" | "delete"

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  @InjectModel(User.name)
  private ConcreteUser!: UserModel

  @InjectModel(Product.name)
  private ConcreteProduct!: ProductModel

  constructor() {}
  createForRolesOwner(rolesOwner: RolesOwner) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    )

    const hasRole = this.createRoleChecker(rolesOwner)

    if (hasRole("super admin")) {
      can("manage", "all")
    }

    // TODO: when admin creation will be implemented
    // restrict admins to manage admins
    if (hasRole("admin")) {
      can("manage", "all")
    }

    if (hasRole("seller")) {
      can("manage", this.ConcreteUser, { id: rolesOwner.id }).because(
        "You can only can manage yourself"
      )
      can("read", Product)
      can("manage", this.ConcreteProduct, { userId: rolesOwner.id }).because(
        "You can only manage your products"
      )
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
