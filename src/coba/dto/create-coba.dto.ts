import { ApiProperty } from "@nestjs/swagger";

export class CreateCobaDto {
    @ApiProperty({type: 'string', format: 'binary'})
    file ?: Express.Multer.File
}
