import { ApiProperty } from "@nestjs/swagger"
import { Task } from "src/task/entities/task.entity"

export class CreateReportregulertorqueDto {
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

    @ApiProperty()
    remark ?: string

    @ApiProperty()
    orderIndex ?: number

    @ApiProperty({type : Task})
    task:Task
}
