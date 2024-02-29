import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';

@Crud({
  model: {
    type: Tenant
  },
  
  dto: {
    create: CreateTenantDto,
    update: UpdateTenantDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Tenant')
@Controller('tenant')
export class TenantController implements CrudController<Tenant> {
  constructor(public service: TenantService) {}

  
}
