import { Module } from '@nestjs/common';
import { CobaService } from './coba.service';
import { CobaController } from './coba.controller';

@Module({
  controllers: [CobaController],
  providers: [CobaService],
  
})
export class CobaModule {}
