import { Injectable } from "@nestjs/common"
import { Request } from "express"
import { ModelsInjectorService } from "src/common/models/injector/models-injector.service"
import { MongooseService } from "src/common/service/mongoose.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { User } from "src/users/user.entity"
import { CreateSessionDto } from "./dto/create-session.dto"
import { Session } from "./session.entity"

@Injectable()
export class SessionsService extends MongooseService<Session> {
  constructor(
    private modelsInjector: ModelsInjectorService,
    private requestsParser: RequestsParserService
  ) {
    super(modelsInjector.sessionModel)
  }

  public makeSessionData({ user, request }: { user: User; request: Request }): CreateSessionDto {
    const userAgent = this.requestsParser.parseUserAgentOrUnknownDevice(request)
    return { userAgent, userId: user.id }
  }
}
