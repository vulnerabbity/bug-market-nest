import { Global, Module } from "@nestjs/common"
import { ModelsModule } from "../models.module"
import { ModelsInjectorService } from "./models-injector.service"

@Global()
@Module({
  imports: [ModelsModule],
  providers: [ModelsInjectorService],
  exports: [ModelsInjectorService]
})
export class ModelsInjectorModule {}
