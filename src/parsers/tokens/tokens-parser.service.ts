import { BadRequestException, Injectable } from "@nestjs/common"
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenPayload,
  TokenType
} from "src/auth/authentication/authentication.interface"

@Injectable()
export class TokensParserService {
  public parseAccessTokenPayloadOrFail(accessTokenPayload: TokenPayload): AccessTokenPayload {
    const result = this.parseTokenPayloadOrFail(accessTokenPayload, "access")

    return result as AccessTokenPayload
  }

  public parseRefreshTokenPayloadOrFail(
    refreshTokenPayload: RefreshTokenPayload
  ): RefreshTokenPayload {
    const result = this.parseTokenPayloadOrFail(refreshTokenPayload, "refresh")

    return result as RefreshTokenPayload
  }

  private parseTokenPayloadOrFail(tokenPayload: TokenPayload, expectedTokenType: TokenType) {
    const isExpectedTokenType = tokenPayload.tokenType === expectedTokenType

    if (isExpectedTokenType) {
      return tokenPayload
    }

    throw new BadRequestException(
      `Expected token type to be ${expectedTokenType}, but get ${tokenPayload.tokenType}`
    )
  }
}
