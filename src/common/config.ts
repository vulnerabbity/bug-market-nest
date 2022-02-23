// Should be getters due nestjs config architecture
// Nest defers initialization process.env

export const appConfig = {
  database: {
    get mongoUri(): string {
      return process.env.MONGO_URI!
    }
  },
  security: {
    tokens: {
      keys: {
        get public() {
          return parseConfigRsaKey(process.env.TOKENS_PUBLIC_KEY!)
        },
        get private(): string {
          return parseConfigRsaKey(process.env.TOKENS_PRIVATE_KEY!)
        }
      },
      get accessTokenTTL() {
        return process.env.ACCESS_TOKEN_TTL!
      },
      get refreshTokeTTL() {
        return process.env.REFRESH_TOKEN_TTL!
      }
    },
    get bcryptSaltFactor(): number {
      return parseInt(process.env.BCRYPT_SALT_FACTOR!)
    }
  }
}

function parseConfigRsaKey(rawKey: string): string {
  // replaces raw "\n" to real line breaker
  return rawKey.replace(/\\n/gm, "\n")
}
