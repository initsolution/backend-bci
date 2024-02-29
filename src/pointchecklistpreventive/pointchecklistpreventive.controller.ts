import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PointchecklistpreventiveService } from './pointchecklistpreventive.service';
import { CreatePointchecklistpreventiveDto } from './dto/create-pointchecklistpreventive.dto';
import { UpdatePointchecklistpreventiveDto } from './dto/update-pointchecklistpreventive.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Pointchecklistpreventive } from './entities/pointchecklistpreventive.entity';

@Crud({
  model: {
    type: Pointchecklistpreventive
  },
  
  dto: {
    create: CreatePointchecklistpreventiveDto,
    update: UpdatePointchecklistpreventiveDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Pointchecklistpreventive')
@Controller('pointchecklistpreventive')
export class PointchecklistpreventiveController implements CrudController<Pointchecklistpreventive> {
  constructor(public service: PointchecklistpreventiveService) {}

  
}
