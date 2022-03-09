import { Module } from "@nestjs/common"
import { CitiesModule } from "./cities/cities.module"
import { CountriesModule } from "./countries/countries.module"

const submodules = [CountriesModule, CitiesModule]

@Module({
  imports: submodules,
  exports: submodules
})
export class LocationsModule {}
