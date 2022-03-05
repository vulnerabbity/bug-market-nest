import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common"

export class DefinedPipe implements PipeTransform {
  constructor(private fieldName: string = "value") {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) {
      throw new BadRequestException(`Field '${this.fieldName}' should be defined`)
    }
    return value
  }
}
