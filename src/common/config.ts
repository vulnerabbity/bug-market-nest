import { config as useDotenv } from "dotenv"

useDotenv()

export const appConfig = {
  database: {
    mongoUri: process.env.MONGO_URI!
  },
  security: {
    tokens: {
      keys: {
        public: parseConfigRsaKey(process.env.TOKENS_PUBLIC_KEY!),
        private: parseConfigRsaKey(process.env.TOKENS_PRIVATE_KEY!)
      },
      accessTokenTTL: process.env.ACCESS_TOKEN_TTL!,
      refreshTokeTTL: process.env.REFRESH_TOKEN_TTL!
    },
    bcryptSaltFactor: parseInt(process.env.BCRYPT_SALT_FACTOR!)
  },
  products: {
    imageLimit: Number(process.env.PRODUCT_IMAGES_LIMIT!)
  },
  APIs: {
    geonamesUsername: process.env.GEONAMES_USERNAME!
  },
  core: {
    host: process.env.HOST ?? "http://localhost:3000",
    port: process.env.PORT ?? 3000
  },
  compression: {
    get imagesQuality(): number {
      return Number(process.env.IMAGES_QUALITY!)
    }
  }
}

function parseConfigRsaKey(rawKey: string): string {
  // replaces raw "\n" to real line breaker
  return rawKey.replace(/\\n/gm, "\n")
}
