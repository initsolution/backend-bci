import { Module } from '@nestjs/common';
import { MasterassetService } from './masterasset.service';
import { MasterassetController } from './masterasset.controller';
import { Masterasset } from './entities/masterasset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Masterasset]),],
  controllers: [MasterassetController],
  providers: [MasterassetService]
})
export class MasterassetModule {}
