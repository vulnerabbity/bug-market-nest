import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Categories {
  @Field(() => [String])
  data!: string[]
}
