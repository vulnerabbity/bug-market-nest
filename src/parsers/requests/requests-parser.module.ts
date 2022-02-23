import { Global, Module } from "@nestjs/common"
import { RequestsParserService } from "./requests-parser.service"

@Global()
@Module({
  providers: [RequestsParserService],
  exports: [RequestsParserService]
})
export class RequestsParserModule {}
