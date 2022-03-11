import { IPaginatedEntities } from "src/common/interface/paginated-entity.interface"
import { Iso3166CountryCode } from "../interfaces/iso-3166.interface"

export class GeonamesEntity {
  geonameId!: number
  countryCode!: Iso3166CountryCode
  name!: string
  toponymName!: string
  fcode!: string
}

export class GeonamesPaginatedEntities implements IPaginatedEntities<GeonamesEntity> {
  data!: GeonamesEntity[]
  totalResultsCount!: number
}
