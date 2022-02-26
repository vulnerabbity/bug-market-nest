import { Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

/**
 * Provides token payload to req.user if token valid
 */
@Injectable()
export class JwtAuthenticationGuard extends AuthGuard("jwt") {}
