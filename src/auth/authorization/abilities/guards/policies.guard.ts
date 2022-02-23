import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { GraphqlParserService } from "src/parsers/graphql/graphql-parser.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { PolicyHandler } from "../abilities.interface"
import { AppAbility, CaslAbilityFactory } from "../casl-ability.factory"
import { CHECK_POLICIES_METADATA_KEY } from "../decorators/check-policies.decorator"

/**
 * Restrict access to users without proper permissions
 */
@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private graphqlParser: GraphqlParserService,
    private requestParser: RequestsParserService,
  ) {}

  canActivate(executionContext: ExecutionContext): boolean {
    const isAllPoliciesAllowed = this.isAllPoliciesAllowed(executionContext)

    if (!isAllPoliciesAllowed) {
      throw new ForbiddenException(
        "Your user account don't have permissions to execute this action",
      )
    }

    return true
  }

  private isAllPoliciesAllowed(executionContext: ExecutionContext) {
    const request = this.graphqlParser.parseGraphqlRequest(executionContext)

    const rolesOwner = this.requestParser.parseRolesOwnerOrFail(request)

    const policyHandlers = this.getPolicyHandlers(executionContext)

    const userAbilities = this.caslAbilityFactory.createForRolesOwner(rolesOwner)

    return policyHandlers.every(handler =>
      this.executePolicyHandler(handler, userAbilities),
    )
  }

  private getPolicyHandlers(executionContext: ExecutionContext): PolicyHandler[] {
    const gqlHandler = this.graphqlParser.parseGraphqlHandler(executionContext)
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_METADATA_KEY,
      gqlHandler,
    )

    return policyHandlers
  }

  private executePolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    const isCallbackHandler = typeof handler === "function"

    if (isCallbackHandler) {
      return handler(ability)
    }

    return handler.handle(ability)
  }
}
