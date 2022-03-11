import { Type } from "@nestjs/common"
import { OmitType } from "@nestjs/graphql"

/**
 * Just copies all existing fields and don't force you to define
 * any more fields like graphql driver expects by default
 */
export function CopyType(classRef: Type<unknown>) {
  return OmitType(classRef, [])
}
