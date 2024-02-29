import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MasterpointchecklistpreventiveService } from './masterpointchecklistpreventive.service';
import { CreateMasterpointchecklistpreventiveDto } from './dto/create-masterpointchecklistpreventive.dto';
import { UpdateMasterpointchecklistpreventiveDto } from './dto/update-masterpointchecklistpreventive.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Masterpointchecklistpreventive } from './entities/masterpointchecklistpreventive.entity';

@Crud({
  model: {
    type: Masterpointchecklistpreventive
  },
  
  dto: {
    create: CreateMasterpointchecklistpreventiveDto,
    update: UpdateMasterpointchecklistpreventiveDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  },
  query : {
    join : {
      'mcategorychecklistpreventive' : {eager :false}
    }
  }
  
})
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Masterpointchecklistpreventive')
@Controller('masterpointchecklistpreventive')
export class MasterpointchecklistpreventiveController implements CrudController<Masterpointchecklistpreventive> {
  constructor(public service: MasterpointchecklistpreventiveService) {}

  
}