import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // register for "class-validator" library validating
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
