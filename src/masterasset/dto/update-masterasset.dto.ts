import { PartialType } from '@nestjs/swagger';
import { CreateMasterassetDto } from './create-masterasset.dto';

export class UpdateMasterassetDto extends PartialType(CreateMasterassetDto) {}
