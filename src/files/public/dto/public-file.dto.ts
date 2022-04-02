import { PublicFile } from "../public-file.entity"

export type PublicFileDto = Omit<PublicFile, "createdAt" | "updatedAt" | "url">
