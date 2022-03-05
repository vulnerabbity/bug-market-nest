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
  }
}

function parseConfigRsaKey(rawKey: string): string {
  // replaces raw "\n" to real line breaker
  return rawKey.replace(/\\n/gm, "\n")
}
