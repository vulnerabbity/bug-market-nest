import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { compare } from "bcrypt"
import { appConfig } from "src/common/config"
import { Session } from "src/sessions/session.entity"
import { User } from "src/users/user.entity"
import { UsersService } from "src/users/users.service"
import {
  AccessAndRefreshToken,
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPayload
} from "./authentication.interface"

@Injectable()
export class AuthenticationService {
  private accessTokenTTL = appConfig.security.tokens.accessTokenTTL
  private refreshTokenTTL = appConfig.security.tokens.refreshTokeTTL
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public signAccessAndRefreshToken({
    user,
    session
  }: {
    user: User
    session: Session
  }): AccessAndRefreshToken {
    const accessToken = this.signAccessToken(user)
    const refreshToken = this.signRefreshToken(session)

    const tokenPair: AccessAndRefreshToken = {
      accessToken,
      refreshToken
    }

    return tokenPair
  }

  public signAccessToken(user: User): string {
    const accessTokenPayload = this.makeAccessTokenPayload(user)

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.accessTokenTTL
    })

    return accessToken
  }

  public signRefreshToken(session: Session): string {
    const refreshTokenPayload = this.makeRefreshTokenPayload(session)

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.refreshTokenTTL
    })

    return refreshToken
  }

  public async isValidPassword(user: User, passwordToCheck: string): Promise<boolean> {
    const currentPassword = user.password
    const isValidPassword = await compare(passwordToCheck, currentPassword)
    return isValidPassword
  }

  public isTokenExpired(tokenPayload: TokenPayload): boolean {
    const currentSecondsSince1970 = Math.floor(Date.now() / 1000)
    const expirationSecondsSince1970 = tokenPayload.exp!

    const isExpired = currentSecondsSince1970 > expirationSecondsSince1970

    return isExpired
  }

  private makeAccessTokenPayload(user: User): AccessTokenPayload {
    const payload: AccessTokenPayload = {
      tokenType: "access",
      userId: user.id,
      roles: user.roles
    }
    return payload
  }

  private makeRefreshTokenPayload(session: Session): RefreshTokenPayload {
    const payload: RefreshTokenPayload = {
      tokenType: "refresh",
      userId: session.userId,
      sessionId: session.id
    }
    return payload
  }
}
