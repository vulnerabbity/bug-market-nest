import { AnyResponse } from "src/common/interface/responses.interface"

export interface PublicFileResponse extends AnyResponse {
  fileUrl: string
}
