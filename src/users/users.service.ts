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
}
