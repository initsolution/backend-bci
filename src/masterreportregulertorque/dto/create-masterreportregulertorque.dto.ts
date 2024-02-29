import { ApiProperty } from "@nestjs/swagger"

export class CreateMasterreportregulertorqueDto {
    @ApiProperty()
    fabricator ?: string

    @ApiProperty()
    towerHeight ?: number

    @ApiProperty()
    towerSegment ?: string

    @ApiProperty()
    elevasi ?: number

    @ApiProperty()
    boltSize ?: string

    @ApiProperty()
    minimumTorque ?: number

    @ApiProperty()
    qtyBolt ?: number
}
