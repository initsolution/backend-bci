import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ReportregulerverticalityService } from './reportregulerverticality.service';
import { BulkCreateReportregulerverticalityDto, CreateReportregulerverticalityDto } from './dto/create-reportregulerverticality.dto';
import { UpdateReportregulerverticalityDto } from './dto/update-reportregulerverticality.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { Reportregulerverticality } from './entities/reportregulerverticality.entity';
import { CreateValueverticalityDto } from 'src/valueverticality/dto/create-valueverticality.dto';
import { ValueverticalityService } from 'src/valueverticality/valueverticality.service';

@Crud({
  model: {
    type: Reportregulerverticality
  },
  
  dto: {
    create: CreateReportregulerverticalityDto,
    update: UpdateReportregulerverticalityDto
  },
  routes :{
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Reportregulerverticality')
@Controller('reportregulerverticality')
export class ReportregulerverticalityController implements CrudController<Reportregulerverticality> {
  constructor(public service: ReportregulerverticalityService, 
    readonly valueVerticalityService: ValueverticalityService
    ) {}

  @Post('insertWithValue')
  async insertWithPoint(@Body() dt: BulkCreateReportregulerverticalityDto){
    // console.log(dt.bulk)
    for(var i=0; i< dt.bulk.length; i++){
      var dtoCategory: CreateReportregulerverticalityDto = dt.bulk[i]
      const categoryChecklistPreventive: Reportregulerverticality = await this.service.customInsertData(dtoCategory)
      console.log(categoryChecklistPreventive)
      for (var j =0; j< dtoCategory.valueVerticalities.length; j++){
        var dtoPoint : CreateValueverticalityDto = dtoCategory.valueVerticalities[j]
        dtoPoint.reportRegulerVerticality = categoryChecklistPreventive
        const pointChecklistPreventive = await this.valueVerticalityService.customInsertData(dtoPoint)
        console.log(pointChecklistPreventive)
      }
    }
  }

  @Override()
  async createOne(@Res() res, @ParsedRequest() req: CrudRequest, @Body() dto: CreateReportregulerverticalityDto){
    console.log('report reguler verticality')
    console.log(dto)
    const categoryChecklistPreventive: Reportregulerverticality = await this.service.customInsertData(dto)
    console.log(categoryChecklistPreventive)
      for (var j =0; j< dto.valueVerticalities.length; j++){
        var dtoPoint : CreateValueverticalityDto = dto.valueVerticalities[j]
        dtoPoint.reportRegulerVerticality = categoryChecklistPreventive
        const pointChecklistPreventive = await this.valueVerticalityService.customInsertData(dtoPoint)
        console.log(pointChecklistPreventive)
      }
      // res.status()
      res.status(HttpStatus.CREATED).send();
  }
}
