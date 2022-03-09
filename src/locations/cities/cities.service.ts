import {
  baseSearchManyParams,
  baseSearchSingleParams,
  GeonameSearchManyParams,
  GeonameSearchSingleParams,
  GeonamesFeatureCodesEnum,
  GeonameShortEntity
} from "../geonames/geonames.interface"
import { GeonamesService } from "../geonames/geonames.service"
import { Iso3166CountryCode } from "../interfaces/iso-3166.interface"
import { City, PaginatedCities } from "./city.object"

const manyCitiesSearchParams: GeonameSearchManyParams = {
  ...baseSearchManyParams,
  orderby: "population",
  fcode: GeonamesFeatureCodesEnum.CITY
}

interface FindingArgs {
  language: string
}

interface FindingManyArgs extends FindingArgs {
  country: Iso3166CountryCode
}
interface FindingSingleArgs extends FindingArgs {
  id: number
}

export class CitiesService extends GeonamesService<City> {
  async findManyPaginated(
    { country, language }: FindingManyArgs,
    { offset, limit }: { offset: number; limit: number }
  ): Promise<PaginatedCities> {
    const paginatedManyCitiesSearchParams: GeonameSearchManyParams = {
      ...manyCitiesSearchParams,
      country: country,
      startRow: offset,
      maxRows: limit,
      lang: language
    }

    const geonameResponse = await this.fetchManyShort(paginatedManyCitiesSearchParams)
    const { geonames: geonameEntities, totalResultsCount } = geonameResponse

    const cities = geonameEntities.map(entity => this.parseFetchedEntity(entity))
    return { data: cities, totalResultsCount }
  }

  async findById({ id, language }: FindingSingleArgs) {
    const findSingleParams: GeonameSearchSingleParams = {
      ...baseSearchSingleParams,
      geonameId: id,
      lang: language
    }
    const geonameEntity = await this.fetchSingle(findSingleParams)
    const city = this.parseFetchedEntity(geonameEntity)
    return city
  }

  protected parseFetchedEntity(shortGeocodeEntity: GeonameShortEntity): City {
    const { geonameId: cityId, name: translatedName, toponymName, countryCode } = shortGeocodeEntity
    return { id: cityId, translatedName, toponymName, countryCode }
  }
}
