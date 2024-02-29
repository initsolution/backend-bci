import { ApiProperty } from "@nestjs/swagger"
import { Employee } from "src/employee/entities/employee.entity"

export class CustomFilterTaskDto{
    @ApiProperty()
    startDateCreatedAt? : string
    
    @ApiProperty()
    endDateCreatedAt? : string
    
    @ApiProperty()
    emailMakerEmployee? : string

    @ApiProperty()
    emailVerifierEmployee? : string
}