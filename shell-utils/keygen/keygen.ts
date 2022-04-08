import { promisify } from "util"
import { exec as execSync } from "child_process"
const executeShell = promisify(execSync)
import { readFileSync } from "fs"

const keyLength = parseInt(process.argv[2] ?? 1024)

const tmpDir = ".tmp.keygen"
const privateKeyName = "rsa.key"
const publicKeyName = "rsa.key.pub"

async function main() {
  await deleteTempDirectory()
  await createTempDirectory()

  const privateKey = await generatePrivateKey()
  const publicKey = await generatePublicKey()

  console.log(publicKey)
  console.log()
  console.log(privateKey)

  await deleteTempDirectory()
}

main()

async function deleteTempDirectory() {
  await executeShell(`rm -rf ${tmpDir}`)
}

async function createTempDirectory() {
  await executeShell(`mkdir ${tmpDir}`)
}

async function generatePrivateKey(): Promise<string> {
  await executeShell(
    `ssh-keygen -N '' -t rsa -b ${keyLength} -m PEM -f ${tmpDir}/${privateKeyName}`
  )
  return readKey(`${tmpDir}/${privateKeyName}`)
}

async function generatePublicKey(): Promise<string> {
  await executeShell(
    `openssl rsa -in ${tmpDir}/${privateKeyName} -pubout -outform PEM -out ${tmpDir}/${publicKeyName}`
  )

  return readKey(`${tmpDir}/${publicKeyName}`)
}

function readKey(path: string): string {
  const key = readFileSync(path, "utf8")
  return formatKey(key)
}

/**
 * Formats key to .env format.
 * In .env format key should be single line with
 * "\n" after "-----BEGIN..." and "\n" before "-----END" like:
 * -----BEGIN KEY-----\nKEY_BODY\n-----END KEY-----
 */
function formatKey(key: string): string {
  const keyLines = key.split("\n")

  let formattedKey = ""
  for (let keyLine of keyLines) {
    if (keyLine.startsWith("-----BEGIN")) {
      formattedKey += keyLine + "\\n"
    } else if (keyLine.startsWith("-----END")) {
      formattedKey += "\\n" + keyLine
    } else {
      formattedKey += keyLine
    }
  }

  return formattedKey
}
