import { Module } from '@nestjs/common';
import { ValueverticalityService } from './valueverticality.service';
import { ValueverticalityController } from './valueverticality.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Valueverticality } from './entities/valueverticality.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Valueverticality]),],
  controllers: [ValueverticalityController],
  providers: [ValueverticalityService]
})
export class ValueverticalityModule {}
