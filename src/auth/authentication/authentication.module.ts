import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { appConfig } from "src/common/config"
import { SessionsModule } from "src/sessions/sessions.module"
import { UsersModule } from "src/users/users.module"
import { AuthenticationResolver } from "./authentication.resolver"
import { AuthenticationService } from "./authentication.service"
import { JwtStrategy } from "./strategies/jwt.strategy"

@Module({
  imports: [
    UsersModule,
    SessionsModule,
    JwtModule.register({
      privateKey: appConfig.security.tokens.keys.private,
      publicKey: appConfig.security.tokens.keys.public,
      signOptions: { algorithm: "RS256" }
    })
  ],
  providers: [AuthenticationService, AuthenticationResolver, JwtStrategy]
})
export class AuthenticationModule {}
