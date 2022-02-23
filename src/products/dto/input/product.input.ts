import { InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql"
import { Product } from "src/products/product.entity"

@InputType()
export class ProductInput extends OmitType(Product, ["id", "userId", "totalCount"]) {
  userId!: string
}
