import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt"
import { appConfig } from "src/common/config"
import { TokenPayload } from "../authentication.interface"
import { AuthenticationService } from "../authentication.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Injecting as field because passport strategy need 0 arguments constructor
  @Inject()
  private authenticationService!: AuthenticationService

  constructor() {
    const jwtStrategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // expiration handled in "validate method"
      ignoreExpiration: true,
      secretOrKey: appConfig.security.tokens.keys.public,
      algorithms: ["RS256"]
    }
    super(jwtStrategyOptions)
  }

  // When returning value - shares token payload in req.user
  // Should be named exactly "validate"
  async validate(payload: TokenPayload) {
    const isTokenExpired = this.authenticationService.isTokenExpired(payload)
    if (isTokenExpired) {
      throw new UnauthorizedException(`Your ${payload.tokenType} token is expired`)
    }
    return payload
  }
}
