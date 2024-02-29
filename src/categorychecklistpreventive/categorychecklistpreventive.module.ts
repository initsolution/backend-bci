import { Module } from '@nestjs/common';
import { CategorychecklistpreventiveService } from './categorychecklistpreventive.service';
import { CategorychecklistpreventiveController } from './categorychecklistpreventive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorychecklistpreventive } from './entities/categorychecklistpreventive.entity';
import { Pointchecklistpreventive } from 'src/pointchecklistpreventive/entities/pointchecklistpreventive.entity';
import { PointchecklistpreventiveService } from 'src/pointchecklistpreventive/pointchecklistpreventive.service';

@Module({
  imports : [TypeOrmModule.forFeature([Categorychecklistpreventive, Pointchecklistpreventive]),],
  controllers: [CategorychecklistpreventiveController],
  providers: [CategorychecklistpreventiveService, PointchecklistpreventiveService]
})
export class CategorychecklistpreventiveModule {}
