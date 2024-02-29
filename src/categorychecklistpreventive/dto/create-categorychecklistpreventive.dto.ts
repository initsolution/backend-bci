import { ApiProperty } from "@nestjs/swagger"
import { CreatePointchecklistpreventiveDto } from "src/pointchecklistpreventive/dto/create-pointchecklistpreventive.dto"
import { Task } from "src/task/entities/task.entity"

export class CreateCategorychecklistpreventiveDto {
    
    @ApiProperty()
    nama ?: string

    @ApiProperty()
    keterangan ?: string

    @ApiProperty()
    orderIndex ?: number

    @ApiProperty({type : Task})
    task:Task

    @ApiProperty({type : [CreatePointchecklistpreventiveDto]})
    pointChecklistPreventives ?: [CreatePointchecklistpreventiveDto]
}

export class BulkCreateCategorychecklistpreventiveDto{
    @ApiProperty()
    bulk : [CreateCategorychecklistpreventiveDto]
}
