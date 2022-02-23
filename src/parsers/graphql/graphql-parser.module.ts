import { Global, Module } from "@nestjs/common"
import { GraphqlParserService } from "./graphql-parser.service"

@Global()
@Module({
  providers: [GraphqlParserService],
  exports: [GraphqlParserService]
})
export class GraphqlParserModule {}
