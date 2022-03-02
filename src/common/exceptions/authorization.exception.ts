import { ForbiddenException } from "@nestjs/common"

export class InvalidPermissionsException extends ForbiddenException {
  constructor() {
    super("Your user account don't have permissions to execute this action")
  }
}
