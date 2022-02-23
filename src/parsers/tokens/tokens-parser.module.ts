import { Global, Module } from "@nestjs/common"
import { TokensParserService } from "./tokens-parser.service"

@Global()
@Module({
  providers: [TokensParserService],
  exports: [TokensParserService]
})
export class TokensParserModule {}
