import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MasterassetService } from './masterasset.service';
import { CreateMasterassetDto } from './dto/create-masterasset.dto';
import { UpdateMasterassetDto } from './dto/update-masterasset.dto';
import { Masterasset } from './entities/masterasset.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';

@Crud({
  model: {
    type: Masterasset
  },
  
  dto: {
    create: CreateMasterassetDto,
    update: UpdateMasterassetDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Master Asset')
@Controller('masterasset')
export class MasterassetController implements CrudController<Masterasset> {
  constructor(public service: MasterassetService) {}

  
}
