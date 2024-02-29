import { Module } from '@nestjs/common';
import { MasterpointchecklistpreventiveService } from './masterpointchecklistpreventive.service';
import { MasterpointchecklistpreventiveController } from './masterpointchecklistpreventive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Masterpointchecklistpreventive } from './entities/masterpointchecklistpreventive.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Masterpointchecklistpreventive]),],
  controllers: [MasterpointchecklistpreventiveController],
  providers: [MasterpointchecklistpreventiveService]
})
export class MasterpointchecklistpreventiveModule {}
