import { Injectable } from "@nestjs/common"
import { GeonamesService } from "../geonames/geonames.service"
import {
  baseSearchManyParams,
  GeonameSearchManyParams,
  GeonamesFeatureCodesEnum,
  GeonameShortEntity
} from "../geonames/geonames.interface"
import { Country, PaginatedCountries } from "./country.objects"
import { PaginationArgs } from "src/common/args/pagination.args"

const manyCountriesSearchParams: GeonameSearchManyParams = {
  ...baseSearchManyParams,
  orderby: "population",
  fcode: GeonamesFeatureCodesEnum.COUNTRY
}

@Injectable()
export class CountriesService extends GeonamesService<Country> {
  async findManyPaginated(
    language: string,
    { offset, limit }: PaginationArgs
  ): Promise<PaginatedCountries> {
    const paginatedCountriesFetchParams = {
      ...manyCountriesSearchParams,
      startRow: offset,
      maxRows: limit,
      lang: language
    }
    const geonameResponse = await this.fetchManyShort(paginatedCountriesFetchParams)
    const { geonames: geonameCountries, totalResultsCount } = geonameResponse

    const countries = geonameCountries.map(country => this.parseFetchedEntity(country))

    return { data: countries, totalResultsCount: totalResultsCount }
  }

  protected parseFetchedEntity(shortGeocodeEntity: GeonameShortEntity): Country {
    const { countryCode, geonameId, name, toponymName } = shortGeocodeEntity
    return { isoCode: countryCode, id: geonameId, toponymName, translatedName: name }
  }
}
