import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, HttpException, Res, HttpStatus } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto, UpdateAllAsset } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreateManyDto, Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Task } from 'src/task/entities/task.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Site } from 'src/site/entities/site.entity';
import { Categorychecklistpreventive } from 'src/categorychecklistpreventive/entities/categorychecklistpreventive.entity';
import { Reportregulertorque } from 'src/reportregulertorque/entities/reportregulertorque.entity';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { TaskService } from 'src/task/task.service';
import { UpdateCycleAsset } from './dto/update-cycle-asset.dto';
import { Response } from 'express'
import { ConfigService } from '@nestjs/config';
let fs = require('fs-extra');

@Crud({
  model: {
    type: Asset
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
      disabled: false, // <= HERE
    },
  },
  dto: {
    create: CreateAssetDto,
    update: UpdateAssetDto
  },
  query: {
    join: {
      'task': {
        eager: false
      },

    }
  },
  routes: {
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Asset')
@Controller('asset')
export class AssetController implements CrudController<Asset> {
  
  constructor(public service: AssetService,
    readonly taskService: TaskService,
    private configService: ConfigService,
  ) { 
    
  }
  get base(): CrudController<Asset> {
    return this
  }

  getEnv(){
    return this.configService.get<string>('FOLDER_DESTINATION')
  }

  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'task-id',
    description: 'untuk folder upload'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const getHeader = req.headers['task-id'] || ''
        // console.log(getHeader)
        const folderenv = process.env.FOLDER_DESTINATION
        const customDestination = `./uploads/assets/${folderenv}/${getHeader}`
        fs.mkdirsSync(customDestination)
        callback(null, customDestination);
      },
      filename: (_req, file, cb) => {

        const filename: String = uuidv4()

        cb(null, `${filename}.jpg`)
      }
    })
  }))
  @Override()
  async createOne(@UploadedFile() file: Express.Multer.File, @ParsedRequest() req: CrudRequest, @Body() dto: CreateAssetDto) {
    var task: Task = {
      id: dto.taskId,
      dueDate: '',
      submitedDate: '',
      verifiedDate: '',
      notBefore : null,
      status: '',
      type: '',
      towerCategory: '',
      makerEmployee: new Employee,
      verifierEmployee: new Employee,
      site: new Site,
      categorychecklistprev: [],
      reportRegulerTorque: [],
      reportRegulerVerticality: new Reportregulerverticality,
      asset: new Asset
    }
    var createAsset = {
      category: dto.category,
      description: dto.description,
      url: file.filename,
      note: dto.note,
      section: dto.section,
      orderIndex: dto.orderIndex,
      isPassed: false,
      task: task
    }

    return await this.base.createOneBase(req, createAsset)
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override()
  async createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Asset>,

  ) {
    try {
      // console.log(dto)
      // return dto
      return await this.base.createManyBase(req, dto);
    } catch (err) {
      throw new HttpException(
        err.message || err.response || JSON.stringify(err),
        err.statusCode || err.status || 500,
      );
    }
  }


  @Override('getOneBase')
  getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Get('getImage/:id')
  async getImage(@Res() res: Response, @Param('id') id: number): Promise<any> {

    const selectedBackground = await this.service.getDataById(id)
    const folderenv = this.configService.get<string>('FOLDER_DESTINATION')
    // return selectedBackground
    res.sendFile(selectedBackground.url, {
      root: `./uploads/assets/${folderenv}/${selectedBackground.task
        .id}`
    })
  }

  @Patch('updateStatusAll')
  async updateStatusAll(@Body() data: UpdateAllAsset) {
    // console.log(data.asset)
    if (data.asset.length > 0) {
      var acceptTotal = 0
      var taskId: number
      var assets: Asset[] = data.asset
      for (var i = 0; i < assets.length; i++) {
        var asset = assets[i]
        taskId = asset.task.id
        if (asset.isPassed) acceptTotal++
        this.service.updateData(asset)
      }
      var task = await this.taskService.findOne({ where: { id: taskId }, relations: ['site', 'makerEmployee', 'verifierEmployee'] })
      task.status = 'rejected'
      task.note = data.note
      if (acceptTotal == assets.length) {
        task.status = 'accepted'
        var date_ob = new Date()
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = ("0" + date_ob.getHours()).slice(-2);
        let minutes = ("0" + date_ob.getMinutes()).slice(-2);
        let seconds = ("0" + date_ob.getSeconds()).slice(-2);
        task.verifiedDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds


      }

      // console.log(`task id : ${taskId} asset ok : ${acceptTotal} total asset : ${assets.length}`)
      // this.taskService.updateCustomTask(task)
      return this.taskService.updateCustomTask(task)
    } else {
      throw new HttpException('No Data Asset', HttpStatus.NOT_FOUND);

    }

  }

  @Patch('changeImage')
  async changeImage(@Body() dto: UpdateCycleAsset) {
    console.log(dto)
    var sourceAsset = await this.service.getDataById(dto.idSource)
    var destination = await this.service.getDataById(dto.idDestination)
    var tempImg = sourceAsset.url

    sourceAsset.url = destination.url
    destination.url = tempImg
    await this.service.updateData(sourceAsset)
    return await this.service.updateData(destination)
  }

  @Get('cobaenv/:mekdi')
  cobaenv(@Param('mekdi') mekdi : string){
    console.log(`mekdi ${mekdi}`)
    const folderenv = this.configService.get<string>('FOLDER_DESTINATION')
    console.log(folderenv)
    return folderenv
  }

  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'task-id',
    description: 'untuk folder upload'
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const getHeader = req.headers['task-id'] || ''
        // console.log(getHeader)
        const folderenv = process.env.FOLDER_DESTINATION
        const customDestination = `./uploads/assets/${folderenv}/${getHeader}`
        fs.mkdirsSync(customDestination)
        callback(null, customDestination);
      },
      filename: (_req, file, cb) => {

        const filename: String = uuidv4()

        cb(null, `${filename}.jpg`)
      }
    })
  }))
  @Patch('uploadImageFromLocal/:idAsset')
  async uploadImageFromLocal(@UploadedFile() file: Express.Multer.File, @Param('idAsset') idAsset : number){
    let asset: Asset = await this.service.getDataById(idAsset)
    const folderenv = this.configService.get<string>('FOLDER_DESTINATION')
    fs.rmSync(`./uploads/assets/${folderenv}/${asset.task.id}/${asset.url}`, { force: true })
    asset.url = file.filename
    return this.service.updateData(asset)
  }
}
