import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { MongooseService } from "src/common/service/mongoose.service"
import { User, UserDocument } from "./user.entity"

@Injectable()
export class UsersService extends MongooseService<User> {
  constructor(
    @InjectModel(User.name)
    private usersModel: Model<UserDocument>
  ) {
    super(usersModel)
  }

  public async findByUsernameOrFail(username: string): Promise<User> {
    return await this.findOneOrFail({ username })
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
