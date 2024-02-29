import { Module } from '@nestjs/common';
import { PointchecklistpreventiveService } from './pointchecklistpreventive.service';
import { PointchecklistpreventiveController } from './pointchecklistpreventive.controller';
import { Pointchecklistpreventive } from './entities/pointchecklistpreventive.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Pointchecklistpreventive]),],
  controllers: [PointchecklistpreventiveController],
  providers: [PointchecklistpreventiveService]
})
export class PointchecklistpreventiveModule {}
