import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { CategorychecklistpreventiveService } from './categorychecklistpreventive.service';
import { BulkCreateCategorychecklistpreventiveDto, CreateCategorychecklistpreventiveDto } from './dto/create-categorychecklistpreventive.dto';
import { UpdateCategorychecklistpreventiveDto } from './dto/update-categorychecklistpreventive.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Categorychecklistpreventive } from './entities/categorychecklistpreventive.entity';
import { CreatePointchecklistpreventiveDto } from 'src/pointchecklistpreventive/dto/create-pointchecklistpreventive.dto';
import { Pointchecklistpreventive } from 'src/pointchecklistpreventive/entities/pointchecklistpreventive.entity';
import { PointchecklistpreventiveService } from 'src/pointchecklistpreventive/pointchecklistpreventive.service';

@Crud({
  model: {
    type: Categorychecklistpreventive
  },
  
  dto: {
    create: CreateCategorychecklistpreventiveDto,
    update: UpdateCategorychecklistpreventiveDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Categorychecklistpreventive')
@Controller('categorychecklistpreventive')
export class CategorychecklistpreventiveController implements CrudController<Categorychecklistpreventive> {
  constructor(public service: CategorychecklistpreventiveService,
    readonly pointChecklistPreventiveService: PointchecklistpreventiveService,
    ) {}

  @Post('insertWithPoint')
  async insertWithPoint(@Res() res, @Body() dt: BulkCreateCategorychecklistpreventiveDto){
    // console.log(dt.bulk)
    for(var i=0; i< dt.bulk.length; i++){
      var dtoCategory: CreateCategorychecklistpreventiveDto = dt.bulk[i]
      const categoryChecklistPreventive: Categorychecklistpreventive = await this.service.customInsertData(dtoCategory)
      console.log(categoryChecklistPreventive)
      for (var j =0; j< dtoCategory.pointChecklistPreventives.length; j++){
        var dtoPoint : CreatePointchecklistpreventiveDto = dtoCategory.pointChecklistPreventives[j]
        dtoPoint.categoryChecklistPreventive = categoryChecklistPreventive
        const pointChecklistPreventive = await this.pointChecklistPreventiveService.customInsertData(dtoPoint)
        console.log(pointChecklistPreventive)
      }
    }
    res.status(HttpStatus.CREATED).send()
  }
}


