import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Masterasset } from 'src/masterasset/entities/masterasset.entity';
import { MasterassetService } from 'src/masterasset/masterasset.service';
import { Mastercategorychecklistpreventive } from 'src/mastercategorychecklistpreventive/entities/mastercategorychecklistpreventive.entity';
import { MastercategorychecklistpreventiveService } from 'src/mastercategorychecklistpreventive/mastercategorychecklistpreventive.service';
import { Masterreportregulertorque } from 'src/masterreportregulertorque/entities/masterreportregulertorque.entity';
import { MasterreportregulertorqueService } from 'src/masterreportregulertorque/masterreportregulertorque.service';
import { Asset } from 'src/asset/entities/asset.entity';
import { AssetService } from 'src/asset/asset.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { Categorychecklistpreventive } from 'src/categorychecklistpreventive/entities/categorychecklistpreventive.entity';
import { CategorychecklistpreventiveService } from 'src/categorychecklistpreventive/categorychecklistpreventive.service';
import { Pointchecklistpreventive } from 'src/pointchecklistpreventive/entities/pointchecklistpreventive.entity';
import { PointchecklistpreventiveService } from 'src/pointchecklistpreventive/pointchecklistpreventive.service';
import { Reportregulertorque } from 'src/reportregulertorque/entities/reportregulertorque.entity';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { ReportregulertorqueService } from 'src/reportregulertorque/reportregulertorque.service';
import { ReportregulerverticalityService } from 'src/reportregulerverticality/reportregulerverticality.service';
import { Valueverticality } from 'src/valueverticality/entities/valueverticality.entity';
import { ValueverticalityService } from '../valueverticality/valueverticality.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports : [
    TenantModule,
    TypeOrmModule.forFeature([Task, Masterasset, Mastercategorychecklistpreventive, Masterreportregulertorque, 
      Asset, Categorychecklistpreventive, Pointchecklistpreventive, Reportregulertorque, Reportregulerverticality, Valueverticality]),],
  controllers: [TaskController],
  providers: [TaskService, MasterassetService, MastercategorychecklistpreventiveService, 
    MasterreportregulertorqueService, AssetService, CategorychecklistpreventiveService, PointchecklistpreventiveService,
    ReportregulertorqueService, ReportregulerverticalityService, ValueverticalityService,ConfigService
  ]
})
export class TaskModule {}
