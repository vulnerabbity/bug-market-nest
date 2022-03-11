import { Field, InputType, OmitType, PartialType } from "@nestjs/graphql"
import { User } from "src/users/user.entity"
import { UserRole } from "src/users/user.interface"

@InputType()
export class UserInput extends OmitType(User, ["id", "products", "avatarUrl", "countryCode"]) {
  @Field()
  password!: string
}

@InputType()
export class CreateUserInput extends OmitType(UserInput, ["roles"]) {
  @Field()
  username!: string
}

@InputType()
export class UpdateUserInput extends PartialType(OmitType(CreateUserInput, ["username"])) {}
