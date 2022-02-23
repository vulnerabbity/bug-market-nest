import { applyDecorators } from "@nestjs/common"
import { Prop } from "@nestjs/mongoose"

/**
 * Makes alias to "updatedAt" in entity schema
 *
 * Schema decorator should have "timestamps: true"
 */
export function MongooseUpdatedAtProp() {
  return applyDecorators(
    Prop({
      get: function (this: any) {
        return this.updatedAt
      }
    })
  )
}

/**
 * Makes alias to "createdAt" in entity schema
 *
 * Schema decorator should have "timestamps: true"
 */
export function MongooseCreatedAtProp() {
  return applyDecorators(
    Prop({
      get: function (this: any) {
        return this.createdAt
      }
    })
  )
}
