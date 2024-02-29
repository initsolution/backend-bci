import { ApiProperty } from "@nestjs/swagger"

export class CreateSiteDto {
    @ApiProperty()
    id ?: string

    @ApiProperty()
    name ?: string

    @ApiProperty()
    towerType ?: string

    @ApiProperty()
    towerHeight ?: number

    @ApiProperty()
    fabricator ?: string

    @ApiProperty()
    tenants ?: string

    @ApiProperty()
    province ?: string

    @ApiProperty()
    region ?: string

    @ApiProperty()
    address ?: string

    @ApiProperty()
    longitude ?: string
    
    @ApiProperty()
    latitude ?: string

    @ApiProperty()
    isHavePJU ?: boolean
}
