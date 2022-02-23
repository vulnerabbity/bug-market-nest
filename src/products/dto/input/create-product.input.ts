import { Args, InputType, OmitType } from "@nestjs/graphql"
import { ProductInput } from "./product.input"

@InputType()
export class CreateProductInput extends OmitType(ProductInput, []) {}

export function CreateProductArgs() {
  return Args("createProductInput")
}
