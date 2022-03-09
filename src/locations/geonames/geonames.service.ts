import axios from "axios"
import {
  GeonameSearchManyParams,
  GeonameSearchSingleParams,
  GeonameShortEntity,
  GeonameShortResponse
} from "../geonames/geonames.interface"
import { parseStringPromise } from "xml2js"

export abstract class GeonamesService<T> {
  private apiManyUrl = "http://api.geonames.org/search?"
  private apiSingleUrl = "http://api.geonames.org/get?"

  protected async fetchSingle(
    searchParams: GeonameSearchSingleParams
  ): Promise<GeonameShortEntity> {
    const apiResponse = await axios.get<string>(this.apiSingleUrl, { params: searchParams })
    const xmlGeonameEntityString = apiResponse.data
    const parsedGeonameEntity = this.parseXMLGeonameEntity(xmlGeonameEntityString)
    return parsedGeonameEntity
  }

  protected async fetchManyShort(params: GeonameSearchManyParams): Promise<GeonameShortResponse> {
    const apiResponse = await axios.get<GeonameShortResponse>(this.apiManyUrl, { params })
    return apiResponse.data
  }

  protected abstract parseFetchedEntity(shortGeocodeEntity: GeonameShortEntity): T

  protected async parseXMLGeonameEntity(xml: string): Promise<GeonameShortEntity> {
    let parsedXML = await parseStringPromise(xml)
    const geonames = parsedXML.geoname
    const name = geonames.name[0]
    const toponymName = geonames.toponymName[0]
    const geonameId = Number(geonames.geonameId[0])
    const fcode = geonames.fcode[0]
    const countryCode = geonames.countryCode[0]

    return { name, toponymName, geonameId, fcode, countryCode }
  }
}
