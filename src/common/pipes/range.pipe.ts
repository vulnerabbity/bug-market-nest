import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe } from "@nestjs/common"

export interface RangePipeInput {
  start?: number
  end: number
}

@Injectable()
export class ParseRangePipe extends ParseIntPipe {
  constructor(private rangePipeInput: RangePipeInput) {
    super()
  }

  async transform(value: string, metadata: ArgumentMetadata) {
    const rangeCandidate = await this.parseIntPipe(value, metadata)

    let { start = 0, end } = this.rangePipeInput

    const isValueOutOfRange = rangeCandidate > end || rangeCandidate < start
    if (isValueOutOfRange) {
      const errorMessage = `Value '${rangeCandidate}' is out of range [${start}, ${end}]`
      throw new BadRequestException(errorMessage)
    }

    return rangeCandidate
  }

  async parseIntPipe(value: string, metadata: ArgumentMetadata): Promise<number> {
    return await super.transform(value, metadata)
  }
}
