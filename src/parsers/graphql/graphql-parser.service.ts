import { ExecutionContext, Injectable } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Request } from "express"

@Injectable()
export class GraphqlParserService {
  public parseGraphqlRequest(executionContext: ExecutionContext): Request {
    const gqlContext = this.parseGraphqlExecutionContext(executionContext)
    const request = gqlContext.req as Request
    return request
  }

  /**
   * Returns a reference to the handler (method) that will be invoked next in the request pipeline.
   */
  public parseGraphqlHandler(executionContext: ExecutionContext): Function {
    const handler = this.createGraphqlExecutionContext(executionContext).getHandler()
    return handler
  }

  public parseGraphqlExecutionContext(executionContext: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(executionContext).getContext()
    return gqlContext
  }

  private createGraphqlExecutionContext(executionContext: ExecutionContext): ExecutionContext {
    return GqlExecutionContext.create(executionContext)
  }
}
