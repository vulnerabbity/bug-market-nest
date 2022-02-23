import { applyDecorators, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

/**
 * Allows login to decorated json endpoint
 *
 * Login endpoint expects json with "username" and "password"
 */
export function LoginEndpointWithUsername() {
  return applyDecorators(UseGuards(AuthGuard("local")))
}
