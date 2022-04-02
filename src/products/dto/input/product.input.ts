import { ArgsType, InputType, OmitType, PartialType } from "@nestjs/graphql"
import { Product } from "src/products/product.entity"

@InputType()
export class ProductInput extends OmitType(Product, [
  "id",
  "userId",
  "imagesUrls",
  "createdAt",
  "imagesIds"
]) {
  userId!: string
}

@InputType()
export class CreateProductInput extends OmitType(ProductInput, []) {}

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}
