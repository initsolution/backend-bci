import { ApiProperty } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"
import { Site } from "src/site/entities/site.entity"

export class CreateTaskDto {
    
    @ApiProperty()
    createdDate : string

    @ApiProperty()
    submitedDate : string

    @ApiProperty()
    verifiedDate : string

    @ApiProperty()
    notBefore ?: string
    
    @ApiProperty()
    status : string

    @ApiProperty()
    note ?: string

    @ApiProperty()
    type : string

    @ApiProperty()
    towerCategory : string

    @ApiProperty({type : Employee})
    makerEmployee : Employee

    @ApiProperty({type : Employee})
    verifierEmployee : Employee

    @ApiProperty({type : Site})
    site : Site
}
