import { Args, ArgsType, InputType, OmitType } from "@nestjs/graphql"
import { UserRole } from "src/users/user.entity"
import { UserInput } from "./user.input"

@InputType()
export class CreateUserInput extends OmitType(UserInput, ["roles"]) {
  roles: UserRole[] = []
}

export function CreateUserArgs() {
  return Args("createUserInput")
}
