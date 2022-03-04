import { userModel } from "src/users/user.entity"
import { UsersService } from "src/users/users.service"
import { DatabaseUtil } from "../utils/db.util"
import {
  booleanShellInput,
  shellInput,
  newPasswordInput,
  newPasswordInputWithConfirm
} from "../utils/shell"

const usersService = new UsersService(userModel)

main()

async function main() {
  await connectToMongo()

  let username = await shellInput("username?: ")
  username = username.trim()

  const isUserExists = await usersService.isExists({ username })
  if (isUserExists === false) {
    const password = await newPasswordInput()

    await usersService.createOrFail({ username, password, roles: ["super admin"] })
    console.log(`Super admin created; username: ${username}`)
    quit()
  }

  const foundedUser = await usersService.findOneOrFail({ username })
  const isSuperAdmin = foundedUser.roles.includes("super admin")

  if (isSuperAdmin === false) {
    console.log("This username is taken by non super admin")
    quit()
  }

  console.log(`Super admin "${username}" already exists`)
  await tryChangePassword(username)
  quit()
}

async function connectToMongo() {
  const dbUtil = new DatabaseUtil()
  await dbUtil.connect()
}

async function tryChangePassword(username: string) {
  const needChangePassword = await booleanShellInput({ question: "changePassword?" })
  if (needChangePassword === false) {
    return
  }

  const newPassword = await newPasswordInputWithConfirm()
  await usersService.changePasswordOrFail({ username }, newPassword)
  console.log(`Successfully changed password for ${username}`)
}

function quit() {
  process.exit(0)
}
