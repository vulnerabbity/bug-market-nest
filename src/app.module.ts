import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { UsersModule } from "src/users/users.module"
import { appConfig } from "./common/config"
import { GlobalRegistrarModule } from "./registrar/global-registrar.module"
import { AuthenticationModule } from "./auth/authentication/authentication.module"
import { ProductsModule } from "./products/products.module"
import { PublicFilesModule } from "./files/public/public-files.module"
import { CategoriesModule } from "./categories/categories.module"

@Module({
  imports: [
    GlobalRegistrarModule,
    AuthenticationModule,
    MongooseModule.forRoot(appConfig.database.mongoUri),
    UsersModule,
    ProductsModule,
    PublicFilesModule,
    CategoriesModule
  ],
  providers: []
})
export class AppModule {}
