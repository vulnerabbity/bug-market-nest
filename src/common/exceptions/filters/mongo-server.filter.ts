import {
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException
} from "@nestjs/common"
import { MongoServerError } from "mongoose/node_modules/mongodb"

@Catch(MongoServerError)
export class MongoServerExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError) {
    const errorCode = exception.code
    if (!errorCode) {
      throw new InternalServerErrorException(exception.message)
    }

    if (errorCode === 11000) {
      throw new ConflictException(
        exception.message,
        "Trying to add resource with unique field that already exists"
      )
    }

    throw new InternalServerErrorException(exception.message)
  }
}
