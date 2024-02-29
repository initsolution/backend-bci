import { Module } from '@nestjs/common';
import { ReportregulerverticalityService } from './reportregulerverticality.service';
import { ReportregulerverticalityController } from './reportregulerverticality.controller';
import { Reportregulerverticality } from './entities/reportregulerverticality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Valueverticality } from 'src/valueverticality/entities/valueverticality.entity';
import { ValueverticalityService } from 'src/valueverticality/valueverticality.service';

@Module({
  imports : [TypeOrmModule.forFeature([Reportregulerverticality, Valueverticality]),],
  controllers: [ReportregulerverticalityController],
  providers: [ReportregulerverticalityService, ValueverticalityService]
})
export class ReportregulerverticalityModule {}
