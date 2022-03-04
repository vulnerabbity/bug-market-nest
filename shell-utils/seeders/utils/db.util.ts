import { connect as mongooseConnect } from "mongoose"
import { config as initDotenvConfig } from "dotenv"
import { appConfig } from "src/common/config"

initDotenvConfig()

export class DatabaseUtil {
  mongoUri = appConfig.database.mongoUri

  async connect() {
    await mongooseConnect(this.mongoUri)
  }
}
