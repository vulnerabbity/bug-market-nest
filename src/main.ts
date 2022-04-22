import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import slowDown from "express-slow-down"
import { appConfig } from "./common/config"

// allow 40 requests per minute without delay
const requestsLimiter = slowDown({
  windowMs: 60_000,
  delayAfter: appConfig.core.slowdownAfter,
  delayMs: 200
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // register for "class-validator" library validating
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use(requestsLimiter)

  await app.listen(appConfig.core.port)
}
bootstrap()
