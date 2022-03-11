import { NotFoundException } from "@nestjs/common"
import {
  GeonamesFeatureCodesEnum,
  SearchManyQuery,
  SearchSingleQuery
} from "./geonames/geonames.interface"
import { GeonamesEntity, GeonamesPaginatedEntities } from "./geonames/geonames.objects"
import { GeonamesService } from "./geonames/geonames.service"
import {
  City,
  Country,
  LocationEntity,
  PaginatedCities,
  PaginatedLocationEntities
} from "./locations.objects"

export class LocationsService extends GeonamesService {
  async findCountryOrFail(query: SearchSingleQuery): Promise<Country> {
    const countryCandidate = await this.fetchSingleOrFail(query)
    const isCountry = this.isCountryFeatureCode(countryCandidate.fcode)
    if (isCountry) {
      const country = this.convertGeonamesEntityToLocationEntity(countryCandidate)
      return country
    }
    throw new NotFoundException("Country does not exists")
  }

  async findCityOrFail(query: SearchSingleQuery): Promise<City> {
    const cityCandidate = await this.fetchSingleOrFail(query)
    const isCity = this.isCityFeatureCode(cityCandidate.fcode)
    if (isCity) {
      const city = this.convertGeonamesEntityToLocationEntity(cityCandidate)
      return city
    }

    throw new NotFoundException("City does not exists")
  }

  async findManyCities(query: SearchManyQuery): Promise<PaginatedCities> {
    const paginatedGeonamesEntities = await this.fetchManyOrFail(
      query,
      GeonamesFeatureCodesEnum.CITY
    )

    return this.convertGeonamesPaginatedEntitiesToLocationEntities(paginatedGeonamesEntities)
  }

  async findManyCountries(query: SearchManyQuery): Promise<PaginatedCities> {
    const paginatedGeonamesEntities = await this.fetchManyOrFail(
      query,
      GeonamesFeatureCodesEnum.COUNTRY
    )

    return this.convertGeonamesPaginatedEntitiesToLocationEntities(paginatedGeonamesEntities)
  }

  private isCountryFeatureCode(featureCode: string): boolean {
    featureCode = this.normalizeFeatureCode(featureCode)
    let countryCode = this.normalizeFeatureCode(GeonamesFeatureCodesEnum.COUNTRY)
    return featureCode === countryCode
  }

  private isCityFeatureCode(featureCode: string): boolean {
    featureCode = this.normalizeFeatureCode(featureCode)
    const cityPattern = this.normalizeFeatureCode("PPL")
    return featureCode.startsWith(cityPattern)
  }

  protected normalizeFeatureCode(featureCode: string): string {
    featureCode = featureCode.toLowerCase()
    featureCode = featureCode.trim()
    return featureCode
  }

  protected convertGeonamesEntityToLocationEntity(geonamesEntity: GeonamesEntity): LocationEntity {
    const { geonameId, countryCode, name, toponymName } = geonamesEntity
    return {
      id: geonameId,
      countryCode,
      name: toponymName,
      translatedName: name
    }
  }

  protected convertGeonamesPaginatedEntitiesToLocationEntities(
    geonames: GeonamesPaginatedEntities
  ): PaginatedLocationEntities {
    const { totalResultsCount, data: geonamesEntities } = geonames

    const locationEntities = geonamesEntities.map(geonamesEntity =>
      this.convertGeonamesEntityToLocationEntity(geonamesEntity)
    )

    return { totalResultsCount, data: locationEntities }
  }
}
