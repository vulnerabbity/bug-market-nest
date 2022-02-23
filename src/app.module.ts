import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersModule } from "src/users/users.module"
import { appConfig } from "./common/config"

import { GlobalRegistrarModule } from "./registrar/global-registrar.module"
import { AuthenticationModule } from "./auth/authentication/authentication.module"

@Module({
  imports: [
    GlobalRegistrarModule,
    AuthenticationModule,
    MongooseModule.forRoot(appConfig.database.mongoUri),
    UsersModule
  ],
  providers: []
})
export class AppModule {}
