import { PartialType } from '@nestjs/swagger';
import { CreateCobaDto } from './create-coba.dto';

export class UpdateCobaDto extends PartialType(CreateCobaDto) {}
