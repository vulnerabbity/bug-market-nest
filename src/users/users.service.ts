import { Injectable } from "@nestjs/common"
import { MongooseService } from "src/common/service/mongoose.service"
import { User, UserFilterQuery, UserModel } from "src/users/user.entity"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class UsersService extends MongooseService<User> {
  constructor(
    @InjectModel(User.name)
    private userModel: UserModel
  ) {
    super(userModel)
  }

  public async findByUsernameOrFail(username: string): Promise<User> {
    return await this.findOneOrFail({ username })
  }

  async changePasswordOrFail(filter: UserFilterQuery, newPassword: string): Promise<void> {
    await this.updateOrFail(filter, { password: newPassword })
  }

  /**
   * "User" retrieved from database is not compatible with Casl.js.
   * See more https://github.com/stalniy/casl/issues/595
   *
   * If you want to use class instance in ability checker first convert using this method.
   * Otherwise it will not be recognized as valid object
   */
  public makeCaslCompatibleUser(databaseRetrievedUser: User): User {
    const caslUser = new User()
    Object.assign(caslUser, databaseRetrievedUser)
    caslUser.id = databaseRetrievedUser.id
    return caslUser
  }
}
