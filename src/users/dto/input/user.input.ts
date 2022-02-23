import { Field, InputType, OmitType } from "@nestjs/graphql"
import { User } from "src/users/user.entity"

@InputType()
export class UserInput extends OmitType(User, ["id", "products"]) {
  @Field()
  password!: string
}
