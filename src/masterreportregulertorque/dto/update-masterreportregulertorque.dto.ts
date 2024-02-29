import { PartialType } from '@nestjs/swagger';
import { CreateMasterreportregulertorqueDto } from './create-masterreportregulertorque.dto';

export class UpdateMasterreportregulertorqueDto extends PartialType(CreateMasterreportregulertorqueDto) {}
