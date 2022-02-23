import { Module } from "@nestjs/common"
import { APP_FILTER } from "@nestjs/core"
import { MongoServerExceptionFilter } from "src/common/exceptions/filters/mongo-server.filter"

// Place to register global exceptions to keep app.module.ts more clean
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: MongoServerExceptionFilter
    }
  ]
})
export class FiltersGlobalRegistrarModule {}
