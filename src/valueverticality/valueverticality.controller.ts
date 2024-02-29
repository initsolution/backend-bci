import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ValueverticalityService } from './valueverticality.service';
import { CreateValueverticalityDto } from './dto/create-valueverticality.dto';
import { UpdateValueverticalityDto } from './dto/update-valueverticality.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { Valueverticality } from './entities/valueverticality.entity';


@Crud({
  model: {
    type: Reportregulerverticality
  },
  
  dto: {
    create: CreateValueverticalityDto,
    update: UpdateValueverticalityDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Valueverticality')
@Controller('valueverticality')
export class ValueverticalityController implements CrudController<Valueverticality> {
  constructor(public service: ValueverticalityService) {}

  
}