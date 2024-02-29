import { ApiProperty } from "@nestjs/swagger"
import { Reportregulerverticality } from "src/reportregulerverticality/entities/reportregulerverticality.entity"

export class CreateValueverticalityDto {
    @ApiProperty()
    theodoliteIndex ?: number

    @ApiProperty()
    section ?: number

    @ApiProperty()
    miringKe ?: string

    @ApiProperty()
    value ?: number

    @ApiProperty({type : Reportregulerverticality})
    reportRegulerVerticality : Reportregulerverticality
}
