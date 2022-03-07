import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Request } from "express"
import { Model } from "mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { RequestsParserService } from "src/parsers/requests/requests-parser.service"
import { User } from "src/users/user.entity"
import { CreateSessionDto } from "./dto/create-session.dto"
import { Session, SessionDocument, SessionModel } from "./session.entity"

@Injectable()
export class SessionsService extends MongooseService<Session> {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: SessionModel,
    private requestsParser: RequestsParserService
  ) {
    super(sessionModel)
  }

  public makeSessionData({ user, request }: { user: User; request: Request }): CreateSessionDto {
    const userAgent = this.requestsParser.parseUserAgentOrUnknownDevice(request)
    return { userAgent, userId: user.id }
  }
}
