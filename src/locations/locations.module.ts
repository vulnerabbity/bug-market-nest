import { Module } from "@nestjs/common"
import { LocationsResolver } from "./locations.resolver"
import { LocationsService } from "./locations.service"

@Module({
  providers: [LocationsService, LocationsResolver],
  exports: [LocationsService]
})
export class LocationsModule {}
