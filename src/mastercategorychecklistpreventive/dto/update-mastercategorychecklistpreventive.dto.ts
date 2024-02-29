import { PartialType } from '@nestjs/swagger';
import { CreateMastercategorychecklistpreventiveDto } from './create-mastercategorychecklistpreventive.dto';

export class UpdateMastercategorychecklistpreventiveDto extends PartialType(CreateMastercategorychecklistpreventiveDto) {}
