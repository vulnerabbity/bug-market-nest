import { PublicFile } from "../public-file.entity"

export type PublicFileDto = Omit<PublicFile, "id">
