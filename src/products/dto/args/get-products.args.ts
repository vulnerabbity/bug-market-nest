import { ArgsType } from "@nestjs/graphql"
import { PaginationArgs } from "src/common/args/pagination.args"

@ArgsType()
export class GetProductsArgs extends PaginationArgs {}
