import { Global, Module } from "@nestjs/common"
import { GraphqlParserModule } from "./graphql/graphql-parser.module"
import { RequestsParserModule } from "./requests/requests-parser.module"
import { TokensParserModule } from "./tokens/tokens-parser.module"

@Global()
@Module({
  imports: [GraphqlParserModule, RequestsParserModule, TokensParserModule]
})
export class ParsersModule {}
