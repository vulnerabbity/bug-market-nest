import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { WsException } from "@nestjs/websockets"
import { Socket } from "socket.io"

@Injectable()
export class JwtWebsocketsAuthenticationGuard extends AuthGuard("jwt") {
  getRequest(context: ExecutionContext) {
    const websocketClient = context.switchToWs().getClient<Socket>()
    // handshake is http request sended before connection was established
    const { handshake: websocketRequest } = websocketClient

    return websocketRequest
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
    // Converts HttpException to WsException as docs says:
    // https://docs.nestjs.com/websockets/guards
    try {
      return super.handleRequest(err, user, info, context, status)
    } catch (err: any) {
      throw new WsException(err)
    }
  }
}
