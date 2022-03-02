import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { Request } from "express"
import { AccessTokenPayload } from "src/auth/authentication/authentication.interface"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"

@Injectable()
export class RequestsParserService {
  public parseUserAgentOrUnknownDevice(request: Request): string {
    return this.parseUserAgentOrUndefined(request) ?? "Unknown device"
  }

  public parseRolesOwnerOrFail(request: Request): RolesOwner {
    const { sub: userId, roles } = request.user as AccessTokenPayload
    const rolesOwner: RolesOwner = { id: userId, roles }
    const rolesOwnerHasRolesArray = Array.isArray(rolesOwner.roles)
    if (rolesOwnerHasRolesArray) {
      return rolesOwner
    }

    throw new InternalServerErrorException("Roles owner has no roles")
  }

  public parseUserIdOrFail(request: Request): string {
    const accessTokenPayload = this.parseAccessTokenPayloadOrFail(request)
    const userId = accessTokenPayload.sub

    return userId
  }

  public parseAccessTokenPayloadOrFail(request: Request) {
    const accessTokenPayload = request.user
    if (accessTokenPayload === undefined) {
      throw new InternalServerErrorException("Expected access token payload but got `undefined`")
    }

    return accessTokenPayload as AccessTokenPayload
  }

  private parseUserAgentOrUndefined(request: Request): string | undefined {
    return request.get("User-Agent")
  }
}
