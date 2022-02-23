import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      buildSchemaOptions: { numberScalarMode: "integer" },
      autoSchemaFile: "schema.gql",
      debug: false,
      playground: true
    })
  ]
})
export class GraphqlRegistrarModule {}
