import { Field, InputType, OmitType } from "@nestjs/graphql"
import { User } from "src/users/user.entity"

@InputType()
export class UserInput extends OmitType(User, ["id", "products", "avatarUrl"]) {
  @Field()
  password!: string
}
