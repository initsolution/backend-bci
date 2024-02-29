import { Module } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { Site } from './entities/site.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports : [TypeOrmModule.forFeature([Site]) ],
  controllers: [SiteController],
  providers: [SiteService]
})
export class SiteModule {}
