import { ApiProperty } from "@nestjs/swagger";
import { Mastercategorychecklistpreventive } from "src/mastercategorychecklistpreventive/entities/mastercategorychecklistpreventive.entity";

export class CreateMasterpointchecklistpreventiveDto {
    @ApiProperty()
    uraian ?: string

    @ApiProperty()
    kriteria ?: string

    @ApiProperty({type : Mastercategorychecklistpreventive})
    mcategorychecklistpreventive:Mastercategorychecklistpreventive
}
