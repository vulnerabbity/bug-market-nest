import { ExecutionContext, Injectable, InternalServerErrorException } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Request } from "express"
import { RolesOwner } from "src/auth/authorization/abilities/abilities.interface"

@Injectable()
export class RequestsParserService {
  public parseUserAgentOrUnknownDevice(request: Request): string {
    return this.parseUserAgentOrUndefined(request) ?? "Unknown device"
  }

  public parseRolesOwnerOrFail(request: Request): RolesOwner {
    const rolesOwner = request.user as RolesOwner
    const rolesOwnerHasRolesArray = Array.isArray(rolesOwner.roles)
    if (rolesOwnerHasRolesArray) {
      return rolesOwner
    }

    throw new InternalServerErrorException("Roles owner has no roles")
  }

  private parseUserAgentOrUndefined(request: Request): string | undefined {
    return request.get("User-Agent")
  }
}
