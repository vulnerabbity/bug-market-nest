import { Field, ObjectType } from "@nestjs/graphql"
import { UserRole } from "src/users/user.entity"

export type AccessTokenType = "access"
export type RefreshTokenType = "refresh"
export type TokenType = AccessTokenType | RefreshTokenType

export interface TokenPayload {
  tokenType: TokenType
  // Jwt subject; Id of user
  sub: string
  iat?: number
  exp?: number
}

export interface AccessTokenPayload extends TokenPayload {
  roles: UserRole[]
  tokenType: AccessTokenType
}

export interface RefreshTokenPayload extends TokenPayload {
  tokenType: RefreshTokenType
  sessionId: string
}

export interface AccessAndRefreshToken {
  accessToken: string
  refreshToken: string
}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token!: string
  @Field()
  refresh_token!: string
}
