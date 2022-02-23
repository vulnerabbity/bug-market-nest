import { BadRequestException } from "@nestjs/common"

export class InvalidObjectIdException extends BadRequestException {
  constructor() {
    super("Object id has invalid format")
  }
}
