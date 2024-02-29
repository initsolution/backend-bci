import { PartialType } from '@nestjs/swagger';
import { CreateReportregulertorqueDto } from './create-reportregulertorque.dto';

export class UpdateReportregulertorqueDto extends PartialType(CreateReportregulertorqueDto) {}
