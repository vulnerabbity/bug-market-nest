import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"
import { JwtGqlAuthenticationGuard } from "src/auth/authentication/guards/jwt-gql-authentication.guard"
import { PolicyHandler } from "../abilities.interface"
import { PoliciesGuard } from "../guards/policies.guard"

export const CHECK_POLICIES_METADATA_KEY = "check_policy"

/**
 * Allows to check casl.js permissions for gql query
 */
export function CheckPolicies(...handlers: PolicyHandler[]) {
  return applyDecorators(
    SetMetadata(CHECK_POLICIES_METADATA_KEY, handlers),
    UseGuards(JwtGqlAuthenticationGuard, PoliciesGuard)
  )
}
