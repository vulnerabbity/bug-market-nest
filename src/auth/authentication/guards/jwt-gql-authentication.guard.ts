import { ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { AuthGuard } from "@nestjs/passport"

/**
 * Provides token payload to req.user if token valid
 */
@Injectable()
export class JwtGqlAuthenticationGuard extends AuthGuard("jwt") {
  // overriding default getRequest method to be GQL compatible
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    return gqlContext.req
  }
}
