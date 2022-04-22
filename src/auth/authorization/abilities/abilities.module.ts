import { Global, Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { CaslAbilityFactory } from "./casl-ability.factory"

@Global()
@Module({
  imports: [PassportModule.register({})],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory]
})
export class AbilitiesModule {}
