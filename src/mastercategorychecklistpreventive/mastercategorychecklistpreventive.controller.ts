import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MastercategorychecklistpreventiveService } from './mastercategorychecklistpreventive.service';
import { CreateMastercategorychecklistpreventiveDto } from './dto/create-mastercategorychecklistpreventive.dto';
import { UpdateMastercategorychecklistpreventiveDto } from './dto/update-mastercategorychecklistpreventive.dto';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Mastercategorychecklistpreventive } from './entities/mastercategorychecklistpreventive.entity';


@Crud({
  model: {
    type: Mastercategorychecklistpreventive
  },
  
  dto: {
    create: CreateMastercategorychecklistpreventiveDto,
    update: UpdateMastercategorychecklistpreventiveDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  },
  query : {
    join : {
      'mpointchecklistpreventive' : {eager :false}
    }
  }
})
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Mastercategorychecklistpreventive')
@Controller('mastercategorychecklistpreventive')
export class MastercategorychecklistpreventiveController implements CrudController<Mastercategorychecklistpreventive> {
  constructor(public service: MastercategorychecklistpreventiveService) {}

  
}
