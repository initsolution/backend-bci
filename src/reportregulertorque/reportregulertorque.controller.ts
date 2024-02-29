import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReportregulertorqueService } from './reportregulertorque.service';
import { CreateReportregulertorqueDto } from './dto/create-reportregulertorque.dto';
import { UpdateReportregulertorqueDto } from './dto/update-reportregulertorque.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Reportregulertorque } from './entities/reportregulertorque.entity';

@Crud({
  model: {
    type: Reportregulertorque
  },
  
  dto: {
    create: CreateReportregulertorqueDto,
    update: UpdateReportregulertorqueDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Reportregulertorque')
@Controller('reportregulertorque')
export class ReportregulertorqueController implements CrudController<Reportregulertorque> {
  constructor(public service: ReportregulertorqueService) {}

  
}
