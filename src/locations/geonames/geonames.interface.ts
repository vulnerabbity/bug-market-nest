import { appConfig } from "src/common/config"
import { Iso3166CountryCode } from "../interfaces/iso-3166.interface"

export type SearchStyle = "SHORT" | "MEDIUM" | "LONG" | "FULL"

// More at https://www.geonames.org/export/codes.html
export enum GeonamesFeatureCodesEnum {
  COUNTRY = "PCLI",
  CITY = "PPL*"
}
export type FeatureCode = `${GeonamesFeatureCodesEnum}`

export interface GeonameBaseSearchParams {
  username: string
  lang?: string
}

export interface GeonameSearchManyParams extends GeonameBaseSearchParams {
  type?: "json"
  startRow?: number
  maxRows?: number
  orderby?: string
  style?: SearchStyle
  fcode?: FeatureCode
  country?: Iso3166CountryCode
}

export interface GeonameSearchSingleParams extends GeonameBaseSearchParams {
  geonameId?: number
}

export interface GeonameShortEntity {
  geonameId: number
  countryCode: Iso3166CountryCode
  name: string
  toponymName: string
  fcode: FeatureCode
}

export interface GeonameShortResponse {
  totalResultsCount: number
  geonames: [GeonameShortEntity]
}

export const baseSearchManyParams: GeonameSearchManyParams = {
  type: "json",
  username: appConfig.APIs.geonamesUsername,
  style: "SHORT"
}

export const baseSearchSingleParams: GeonameSearchSingleParams = {
  username: appConfig.APIs.geonamesUsername
}
