import { ApiProperty } from "@nestjs/swagger"

export class CreateMasterassetDto {
    @ApiProperty()
    taskType ?: string

    @ApiProperty()
    section ?: string

    @ApiProperty()
    fabricator ?: string

    @ApiProperty()
    category ?: string

    @ApiProperty()
    description?: string

    @ApiProperty()
    towerHeight ?: number
}
