import { Module } from '@nestjs/common';
import { MasterreportregulertorqueService } from './masterreportregulertorque.service';
import { MasterreportregulertorqueController } from './masterreportregulertorque.controller';
import { Masterreportregulertorque } from './entities/masterreportregulertorque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Masterreportregulertorque]),],
  controllers: [MasterreportregulertorqueController],
  providers: [MasterreportregulertorqueService]
})
export class MasterreportregulertorqueModule {}
