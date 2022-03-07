import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ParsersModule } from "src/parsers/parsers.module"
import { FiltersGlobalRegistrarModule } from "./filters-registrar.module"
import { GraphqlRegistrarModule } from "./graphql-registrar.module"

// Place to register things that will make app.module.ts ugly
@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphqlRegistrarModule,
    FiltersGlobalRegistrarModule,
    ParsersModule
  ],
  exports: [FiltersGlobalRegistrarModule, ParsersModule]
})
export class GlobalRegistrarModule {}
