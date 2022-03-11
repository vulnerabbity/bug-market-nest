import axios, { AxiosResponse } from "axios"
import {
  SearchManyQuery,
  SearchSingleQuery,
  GeonamesManyResponse,
  GeonamesXMLResponse,
  GeonamesManyRequestParams,
  GeonamesSingleRequestParams
} from "../geonames/geonames.interface"
import { parseStringPromise } from "xml2js"
import { InternalServerErrorException, NotFoundException } from "@nestjs/common"
import { appConfig } from "src/common/config"
import { GeonamesEntity, GeonamesPaginatedEntities } from "./geonames.objects"

export class GeonamesService {
  private apiManyUrl = "http://api.geonames.org/search?"
  private apiSingleUrl = "http://api.geonames.org/get?"
  private apiUsername = appConfig.APIs.geonamesUsername

  protected async fetchSingle(query: SearchSingleQuery): Promise<GeonamesEntity> {
    const requestParams = this.convertSearchSingleQueryToRequestParams(query)
    let apiResponse: AxiosResponse<string>
    try {
      apiResponse = await axios.get<string>(this.apiSingleUrl, { params: requestParams })
    } catch (error: any) {
      const isNotFound = error.response.status === 404
      if (isNotFound) {
        throw new NotFoundException()
      }
      throw new InternalServerErrorException()
    }
    const xmlGeonameEntityString = apiResponse.data
    const parsedGeonameEntity = this.parseXMLGeonameEntity(xmlGeonameEntityString)
    return parsedGeonameEntity
  }

  protected async fetchMany(
    query: SearchManyQuery,
    featureCode: string
  ): Promise<GeonamesPaginatedEntities> {
    const requestParams = this.convertSearchManyQueryToRequestParams(query, featureCode)
    let apiResponse: AxiosResponse<GeonamesManyResponse>
    try {
      apiResponse = await axios.get<GeonamesManyResponse>(this.apiManyUrl, {
        params: requestParams
      })
    } catch {
      console.log("test")
      throw new InternalServerErrorException("Geonames api problem")
    }
    const { geonames: geonamesEntities, totalResultsCount } = apiResponse.data
    return { data: geonamesEntities, totalResultsCount }
  }

  private async parseXMLGeonameEntity(xml: string): Promise<GeonamesEntity> {
    let parsedXML: GeonamesXMLResponse = await parseStringPromise(xml)
    const geonames = parsedXML.geoname
    const name = geonames.name[0]
    const toponymName = geonames.toponymName[0]
    const geonameId = Number(geonames.geonameId[0])
    const fcode = geonames.fcode[0]
    const countryCode = geonames.countryCode[0]

    return { name, toponymName, geonameId, fcode, countryCode }
  }

  private convertSearchManyQueryToRequestParams(
    searchQuery: SearchManyQuery,
    featureCode: string
  ): GeonamesManyRequestParams {
    const { countryCode, languageCode, limit, offset, sorting } = searchQuery
    return {
      username: this.apiUsername,
      country: countryCode,
      lang: languageCode,
      startRow: offset,
      maxRows: limit,
      orderby: sorting,
      style: "SHORT",
      type: "json",
      fcode: featureCode
    }
  }

  private convertSearchSingleQueryToRequestParams(
    query: SearchSingleQuery
  ): GeonamesSingleRequestParams {
    return {
      username: this.apiUsername,
      geonameId: query.id,
      lang: query.languageCode
    }
  }
}
