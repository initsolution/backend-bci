import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database.module';
import { EmployeeModule } from './employee/employee.module';
import { TenantModule } from './tenant/tenant.module';
import { SiteModule } from './site/site.module';
import { MasterassetModule } from './masterasset/masterasset.module';
import { TaskModule } from './task/task.module';
import { AssetModule } from './asset/asset.module';
import { MastercategorychecklistpreventiveModule } from './mastercategorychecklistpreventive/mastercategorychecklistpreventive.module';
import { MasterpointchecklistpreventiveModule } from './masterpointchecklistpreventive/masterpointchecklistpreventive.module';
import { CategorychecklistpreventiveModule } from './categorychecklistpreventive/categorychecklistpreventive.module';
import { PointchecklistpreventiveModule } from './pointchecklistpreventive/pointchecklistpreventive.module';
import { ReportregulertorqueModule } from './reportregulertorque/reportregulertorque.module';
import { ReportregulerverticalityModule } from './reportregulerverticality/reportregulerverticality.module';
import { ValueverticalityModule } from './valueverticality/valueverticality.module';
import { MasterreportregulertorqueModule } from './masterreportregulertorque/masterreportregulertorque.module';
import { CobaModule } from './coba/coba.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PORT: Joi.number(),
    }),

  }),
    DatabaseModule,
    EmployeeModule,
    TenantModule,
    SiteModule,
    MasterassetModule,
    TaskModule,
    AssetModule,
    MastercategorychecklistpreventiveModule,
    MasterpointchecklistpreventiveModule,
    CategorychecklistpreventiveModule,
    PointchecklistpreventiveModule,
    ReportregulertorqueModule,
    ReportregulerverticalityModule,
    ValueverticalityModule,
    MasterreportregulertorqueModule,
    CobaModule,
    MailModule
  ],
  
})
export class AppModule { }
