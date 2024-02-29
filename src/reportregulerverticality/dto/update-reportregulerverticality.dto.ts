import { PartialType } from '@nestjs/swagger';
import { CreateReportregulerverticalityDto } from './create-reportregulerverticality.dto';

export class UpdateReportregulerverticalityDto extends PartialType(CreateReportregulerverticalityDto) {}
