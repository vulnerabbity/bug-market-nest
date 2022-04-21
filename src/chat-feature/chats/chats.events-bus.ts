import { Injectable } from "@nestjs/common"
import { Subject } from "rxjs"
import { Chat } from "./chat.entity"

@Injectable()
export class ChatsEventsBus {
  chatDeleted$ = new Subject<Chat>()

  chatCreated$ = new Subject<Chat>()
}
