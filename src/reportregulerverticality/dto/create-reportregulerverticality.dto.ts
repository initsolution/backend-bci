import { ApiProperty } from "@nestjs/swagger"
import { Task } from "src/task/entities/task.entity"
import { CreateValueverticalityDto } from "src/valueverticality/dto/create-valueverticality.dto"

export class CreateReportregulerverticalityDto {
    @ApiProperty()
    horizontalityAb ?: number

    @ApiProperty()
    horizontalityBc ?: number

    @ApiProperty()
    horizontalityCd ?: number

    @ApiProperty()
    horizontalityDa ?: number

    @ApiProperty()
    theodolite1 ?: string

    @ApiProperty()
    theodolite2 ?: string

    @ApiProperty()
    alatUkur ?: string

    @ApiProperty()
    toleransiKetegakan ?: number

    @ApiProperty({type : Task})
    task : Task

    @ApiProperty({type : [CreateValueverticalityDto]})
    valueVerticalities ?: [CreateValueverticalityDto]
}

export class BulkCreateReportregulerverticalityDto{
    @ApiProperty()
    bulk : [CreateReportregulerverticalityDto]
}