import { InputType, OmitType, PartialType } from "@nestjs/graphql"
import { Category } from "../category.entity"

@InputType()
export class CategoryInput extends OmitType(Category, ["id"]) {}

@InputType()
export class CreateCategoryInput extends OmitType(CategoryInput, ["products"]) {}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
