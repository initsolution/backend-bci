import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantDto {
    @ApiProperty()
    kodeTenant ?: string

    @ApiProperty()
    name ?: string

    @ApiProperty()
    isActive?: boolean

}
