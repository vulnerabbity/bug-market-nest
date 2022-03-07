import { registerEnumType } from "@nestjs/graphql"
import { PublicFileDto } from "src/files/public/dto/public-file.dto"

export enum UserRolesEnum {
  SELLER = "seller",
  ADMIN = "admin",
  SUPER_ADMIN = "super admin"
}

registerEnumType(UserRolesEnum, { name: "UserRolesEnum" })

// converts enum to union type
export type UserRole = `${UserRolesEnum}`

export type UploadAvatarDto = Omit<PublicFileDto, "url">
