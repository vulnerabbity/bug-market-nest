import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class Range {
  @Field({ defaultValue: 0 })
  min!: number

  @Field()
  max!: number
}
