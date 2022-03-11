import { Field, InputType, registerEnumType } from "@nestjs/graphql"
import { Max } from "class-validator"
import { Iso3166CountriesCodesEnum, Iso3166CountryCode } from "../interfaces/iso-3166.interface"
import { GeonamesEntity } from "./geonames.objects"

registerEnumType(Iso3166CountriesCodesEnum, { name: "countryCodes" })

@InputType()
export class SearchManyQuery {
  @Field({ nullable: true })
  languageCode?: string
  @Field(() => Iso3166CountriesCodesEnum, { nullable: true })
  countryCode?: Iso3166CountryCode
  @Field({ defaultValue: 0 })
  offset!: number
  @Max(1000)
  @Field({ defaultValue: 100 })
  limit!: number
  @Field({ nullable: true, defaultValue: "population" })
  sorting?: "population" | string
}

@InputType()
export class SearchSingleQuery {
  @Field()
  id!: number
  @Field({ nullable: true })
  languageCode?: string
}

export type SearchStyle = "SHORT" | "MEDIUM" | "LONG" | "FULL"

// More at https://www.geonames.org/export/codes.html
export enum GeonamesFeatureCodesEnum {
  COUNTRY = "PCLI",
  CITY = "PPL*"
}
export type FeatureCode = `${GeonamesFeatureCodesEnum}`

export interface GeonamesBaseRequestParams {
  username: string
  lang?: string
}

export interface GeonamesManyRequestParams extends GeonamesBaseRequestParams {
  type?: "json"
  startRow?: number
  maxRows?: number
  orderby?: string
  style?: SearchStyle
  fcode?: string
  country?: Iso3166CountryCode
}

export interface GeonamesSingleRequestParams extends GeonamesBaseRequestParams {
  geonameId?: number
}

export interface GeonamesManyResponse {
  totalResultsCount: number
  geonames: [GeonamesEntity]
}

export interface GeonamesXMLResponse {
  geoname: {
    name: string[]
    toponymName: string[]
    geonameId: string[]
    fcode: FeatureCode[]
    countryCode: Iso3166CountryCode[]
  }
}
