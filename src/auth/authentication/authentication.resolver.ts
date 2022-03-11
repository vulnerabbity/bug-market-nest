import { ForbiddenException, UnauthorizedException } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { GraphqlRequest } from "src/common/decorators/graphql/request.decorator"
import { TokensParserService } from "src/parsers/tokens/tokens-parser.service"
import { SessionsService } from "src/sessions/sessions.service"
import { User } from "src/users/user.entity"
import { UsersService } from "src/users/users.service"
import { LoginResponse, TokenPayload } from "./authentication.interface"
import { AuthenticationService } from "./authentication.service"

@Resolver(() => LoginResponse)
export class AuthenticationResolver {
  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private sessionService: SessionsService,
    private jwtService: JwtService,
    private tokensParser: TokensParserService
  ) {}
  @Query(() => LoginResponse)
  public async loginWithUsername(
    @Args("username") username: string,
    @Args("password") password: string,
    @GraphqlRequest() request: Request
  ): Promise<LoginResponse> {
    const user = await this.usersService.findByUsernameOrFail(username)
    await this.rejectIfInvalidPassword({ user, password })

    const sessionData = this.sessionService.makeSessionData({ user, request })

    const session = await this.sessionService.createOrFail(sessionData)

    const { accessToken, refreshToken } = this.authenticationService.signAccessAndRefreshToken({
      user,
      session
    })

    return { access_token: accessToken, refresh_token: refreshToken }
  }

  @Query(() => LoginResponse)
  public async refreshAccessToken(
    @Args("refreshToken") refreshToken: string
  ): Promise<LoginResponse> {
    const parsedTokenPayload = this.jwtService.verify<TokenPayload>(refreshToken)
    const refreshTokenPayload = this.tokensParser.parseRefreshTokenPayloadOrFail(parsedTokenPayload)

    const hasSession = await this.sessionService.isExists({ id: refreshTokenPayload.sessionId })
    if (hasSession === false) {
      throw new ForbiddenException("Session no more exists")
    }
    const user = await this.usersService.findByIdOrFail(refreshTokenPayload.userId)
    const accessToken = this.authenticationService.signAccessToken(user)
    return { access_token: accessToken, refresh_token: refreshToken }
  }

  private async rejectIfInvalidPassword({ user, password }: { user: User; password: string }) {
    const isValidPassword = await this.authenticationService.isValidPassword(user, password)

    if (isValidPassword === false) {
      throw new UnauthorizedException("Invalid password")
    }
  }
}
