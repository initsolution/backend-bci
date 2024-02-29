import { ApiProperty } from "@nestjs/swagger"
import { Task } from "src/task/entities/task.entity"
import { Asset } from "../entities/asset.entity"

export class CreateAssetDto {
    
    @ApiProperty()
    category ?: string

    @ApiProperty()
    description ?: string

    @ApiProperty()
    url ?: string

    @ApiProperty()
    isPassed ?: boolean

    @ApiProperty()
    note ?: string

    @ApiProperty()
    section ?: string

    @ApiProperty()
    orderIndex ?: number

    @ApiProperty()
    taskId: number

    @ApiProperty({type: 'string', format: 'binary'})
    file ?: Express.Multer.File
}

export class UpdateAllAsset{
    asset: Asset[]
    note ?: string
}