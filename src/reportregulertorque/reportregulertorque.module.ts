import { Module } from '@nestjs/common';
import { ReportregulertorqueService } from './reportregulertorque.service';
import { ReportregulertorqueController } from './reportregulertorque.controller';
import { Reportregulertorque } from './entities/reportregulertorque.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Reportregulertorque]),],
  controllers: [ReportregulertorqueController],
  providers: [ReportregulertorqueService]
})
export class ReportregulertorqueModule {}
