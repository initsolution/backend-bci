import { ApiProperty } from "@nestjs/swagger"
import { Categorychecklistpreventive } from "src/categorychecklistpreventive/entities/categorychecklistpreventive.entity"

export class CreatePointchecklistpreventiveDto {
    @ApiProperty()
    uraian ?: string
    
    @ApiProperty()
    kriteria ?: string

    @ApiProperty()
    hasil ?: string

    @ApiProperty()
    keterangan ?: string

    @ApiProperty()
    orderIndex ?: number
    
    @ApiProperty()
    isChecklist ?: boolean

    @ApiProperty({type : Categorychecklistpreventive})
    categoryChecklistPreventive ?: Categorychecklistpreventive
}
