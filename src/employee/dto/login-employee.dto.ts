import { ApiProperty } from "@nestjsx/crud/lib/crud";
import { IsNotEmpty } from "class-validator";

export class LoginEmployeeDTO{
    @IsNotEmpty()
    @ApiProperty()
    password : string
    
    @IsNotEmpty()
    @ApiProperty()
    email : string
}