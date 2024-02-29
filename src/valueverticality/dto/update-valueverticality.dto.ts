import { PartialType } from '@nestjs/swagger';
import { CreateValueverticalityDto } from './create-valueverticality.dto';

export class UpdateValueverticalityDto extends PartialType(CreateValueverticalityDto) {}
