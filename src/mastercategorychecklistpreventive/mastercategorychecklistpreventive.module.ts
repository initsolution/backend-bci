import { Module } from '@nestjs/common';
import { MastercategorychecklistpreventiveService } from './mastercategorychecklistpreventive.service';
import { MastercategorychecklistpreventiveController } from './mastercategorychecklistpreventive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mastercategorychecklistpreventive } from './entities/mastercategorychecklistpreventive.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Mastercategorychecklistpreventive]),],
  controllers: [MastercategorychecklistpreventiveController],
  providers: [MastercategorychecklistpreventiveService]
})
export class MastercategorychecklistpreventiveModule {}
