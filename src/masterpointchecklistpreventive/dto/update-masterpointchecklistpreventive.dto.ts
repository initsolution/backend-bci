import { PartialType } from '@nestjs/swagger';
import { CreateMasterpointchecklistpreventiveDto } from './create-masterpointchecklistpreventive.dto';

export class UpdateMasterpointchecklistpreventiveDto extends PartialType(CreateMasterpointchecklistpreventiveDto) {}
