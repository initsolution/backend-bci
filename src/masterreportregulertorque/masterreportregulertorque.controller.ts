import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MasterreportregulertorqueService } from './masterreportregulertorque.service';
import { CreateMasterreportregulertorqueDto } from './dto/create-masterreportregulertorque.dto';
import { UpdateMasterreportregulertorqueDto } from './dto/update-masterreportregulertorque.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Masterreportregulertorque } from './entities/masterreportregulertorque.entity';

@Crud({
  model: {
    type: Masterreportregulertorque
  },
  
  dto: {
    create: CreateMasterreportregulertorqueDto,
    update: UpdateMasterreportregulertorqueDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Masterreportregulertorque')
@Controller('masterreportregulertorque')
export class MasterreportregulertorqueController implements CrudController<Masterreportregulertorque> {
  constructor(public service: MasterreportregulertorqueService) {}

  
}
