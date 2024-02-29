import { PartialType } from '@nestjs/swagger';
import { CreateCategorychecklistpreventiveDto } from './create-categorychecklistpreventive.dto';

export class UpdateCategorychecklistpreventiveDto extends PartialType(CreateCategorychecklistpreventiveDto) {}
