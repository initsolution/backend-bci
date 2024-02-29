import { ApiProperty } from "@nestjs/swagger"

export class CreateEmployeeDto {
    @ApiProperty()
    nik ?:string

    @ApiProperty()
    name ?: string
    
    @ApiProperty()
    email ?: string

    @ApiProperty()
    hp ?: string

    @ApiProperty()
    role ?: string

    @ApiProperty()
    password ?: string

    @ApiProperty()
    isActive ?: boolean

    @ApiProperty()
    isVendor ?: boolean

    @ApiProperty()
    urlEsign ?:string

    @ApiProperty()
    instansi ?:string

    @ApiProperty()
    tokenReset ?:string
}
