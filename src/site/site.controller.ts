import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';

@Crud({
  model: {
    type: Site
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true
    }
  },
  dto: {
    create: CreateSiteDto,
    update: UpdateSiteDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Site')
@Controller('site')
export class SiteController implements CrudController<Site> {
  constructor(public service: SiteService) {}

  
}
