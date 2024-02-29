import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { TaskService } from 'src/task/task.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Categorychecklistpreventive } from 'src/categorychecklistpreventive/entities/categorychecklistpreventive.entity';
import { CategorychecklistpreventiveService } from 'src/categorychecklistpreventive/categorychecklistpreventive.service';
import { Pointchecklistpreventive } from 'src/pointchecklistpreventive/entities/pointchecklistpreventive.entity';
import { PointchecklistpreventiveService } from 'src/pointchecklistpreventive/pointchecklistpreventive.service';
import { Reportregulertorque } from 'src/reportregulertorque/entities/reportregulertorque.entity';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { Valueverticality } from 'src/valueverticality/entities/valueverticality.entity';
import { ReportregulertorqueService } from 'src/reportregulertorque/reportregulertorque.service';
import { ReportregulerverticalityService } from 'src/reportregulerverticality/reportregulerverticality.service';
import { ValueverticalityService } from 'src/valueverticality/valueverticality.service';

@Module({
  
  imports : [
    ConfigModule,
    TenantModule,
    TypeOrmModule.forFeature([Asset, Task, Categorychecklistpreventive, Pointchecklistpreventive, Reportregulertorque, Reportregulerverticality, Valueverticality]),],
  controllers: [AssetController],
  providers: [AssetService, TaskService, CategorychecklistpreventiveService, PointchecklistpreventiveService, ConfigService, ReportregulertorqueService, ReportregulerverticalityService,ValueverticalityService]
})
export class AssetModule {}
