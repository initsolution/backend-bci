import { PartialType } from '@nestjs/swagger';
import { CreatePointchecklistpreventiveDto } from './create-pointchecklistpreventive.dto';

export class UpdatePointchecklistpreventiveDto extends PartialType(CreatePointchecklistpreventiveDto) {}
