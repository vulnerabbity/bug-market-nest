import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Session, SessionSchema } from "./session.entity"
import { SessionsService } from "./sessions.service"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Session.name,
        schema: SessionSchema
      }
    ])
  ],
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule {}
