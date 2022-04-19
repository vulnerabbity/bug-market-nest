import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Socket } from "socket.io"

/**
 * Use this decorator if you want to get
 * websocket http request handshake
 */
export const WSRequest = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const wsClient = context.switchToWs().getClient<Socket>()
  const { handshake: wsRequest } = wsClient

  return wsRequest
})
