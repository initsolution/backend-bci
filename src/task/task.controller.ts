import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, HttpException, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/employee/auth/jwt.auth.guard';
import { MasterassetService } from '../masterasset/masterasset.service';
import { CustomQueryMasterasset } from 'src/masterasset/dto/custom-query-masterasset.dto';
import { MastercategorychecklistpreventiveService } from 'src/mastercategorychecklistpreventive/mastercategorychecklistpreventive.service';
import { MasterreportregulertorqueService } from 'src/masterreportregulertorque/masterreportregulertorque.service';
import { before } from 'node:test';
import { Masterasset } from 'src/masterasset/entities/masterasset.entity';
import { AssetService } from 'src/asset/asset.service';
import * as moment from 'moment'
import { join } from 'path';
import { createReadStream } from 'fs';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron'
import { ConfigService } from '@nestjs/config';

@Crud({
  model: {
    type: Task
  },

  dto: {
    create: CreateTaskDto,
    update: UpdateTaskDto
  },
  routes: {
    // exclude : ['createManyBase', 'deleteOneBase', 'replaceOneBase']
  },
  query: {
    join: {
      'makerEmployee': { eager: false },
      'verifierEmployee': { eager: false },
      'site': { eager: false },
      'categorychecklistprev' : {eager:false},
      'categorychecklistprev.pointChecklistPreventive' : {eager:false},
      'reportRegulerTorque' : {eager: false},
      'reportRegulerVerticality' : {eager: false},
      'reportRegulerVerticality.valueVerticality' : {eager: false},

    }
  }
})

// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@ApiTags('Task')
@Controller('task')
export class TaskController implements CrudController<Task> {
  constructor(public service: TaskService,
    private readonly masterAssetService: MasterassetService,
    private readonly masterCategoryChecklistPreventiveService: MastercategorychecklistpreventiveService,
    private readonly masterReportRegulerTorqueervice: MasterreportregulertorqueService,
    private readonly assetService: AssetService,
    private configService: ConfigService,
  ) { }
  private readonly logger = new Logger(TaskController.name);

  get base(): CrudController<Task> { return this; }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest) {
    // function search(searches) {
    //   console.log(searches)
    //   if (searches.$and)
    //     search(searches.$and);
    //   if (searches.$or)
    //     search(searches.$or);
    //   if (Array.isArray(searches))
    //     searches.forEach(filter => {
    //       Object.keys(filter).filter(col => dateProp.includes(col)).forEach(col => {
    //         Object.keys(filter[col]).forEach(condition => {
    //           try {
    //             filter[col][condition] = moment(new Date(filter[col][condition])).format('YYYY-MM-DD');
    //           }
    //           catch { }
    //         });
    //       });
    //     });
    // }
    // let dateProp = [ 'created_at', 'updated_at'];
    // search(req.parsed.search);
    
    
    var dtTask: Task[];
    await this.base.getManyBase(req).then((dt: Task[]) => {
      dtTask = dt
    })
    dtTask.sort((a,b) => a.created_at.getUTCDate() - b.created_at.getUTCDate() || a.id - b.id)
    // console.log(dtTask)
    var result = []
    for (var i = 0; i < dtTask.length; i++) {
      var task: Task = dtTask[i]
      if (task.status == 'todo' || task.status == 'expired') {
        var res
        
        var dtoMasterAsset: CustomQueryMasterasset = {
          fabricator: task.type == 'Reguler' ? task.site.fabricator : null,
          taskType: task.type,
          towerHeight: task.type == 'Reguler' ? task.site.towerHeight : null,
          isHavePJU : task.site.isHavePJU
        }
        var masterReportRegTorque = task.type == 'Reguler' ? await this.masterReportRegulerTorqueervice.getData(dtoMasterAsset) : null
        var masterAsset = await this.masterAssetService.getData(dtoMasterAsset)

        var masterChecklist = task.type == 'Preventive' ?
          await this.masterCategoryChecklistPreventiveService.customGetAll()
          : null

        if (task.type == 'Preventive') {
          var listPanelKwh = masterAsset.filter((e) => e.category == 'PANEL KWH')
          var listPanelAcpdb = masterAsset.filter((e) => e.category == 'PANEL ACPDB')
          var listGrounding = masterAsset.filter((e) => e.category == 'GROUNDING & LIGHTNING PROTECTION')

          var listChecklistPanelKwh = masterChecklist.filter((e) => e.categoryName.toLowerCase() == 'panel kwh')
          var listChecklistPanelAcpdb = masterChecklist.filter((e) => e.categoryName.toLowerCase() == 'panel acpdb')
          var listChecklistGrounding = masterChecklist.filter((e) => e.categoryName.toLowerCase() == 'grounding & lightning protection system')

          var codeTenant = task.site.tenants.split(';')
          // console.log(codeTenant.length + ' size')
          var editKwh
          var editPANELACPDB
          var editGrounding

          var editChecklistPanelKwh
          var editChecklistPANELACPDB
          var editChecklistGrounding

          if (codeTenant.length > 0) {

            for (var j = 0; j < codeTenant.length; j++) {
              editChecklistPanelKwh = listChecklistPanelKwh.map(before => ({
                id : before.id,
                created_at : before.created_at,
                updated_at : before.updated_at,
                categoryName : before.categoryName + ' ' +codeTenant[j],
                mpointchecklistpreventive : before.mpointchecklistpreventive
              }))

              editChecklistPANELACPDB = listChecklistPanelAcpdb.map(before => ({
                id : before.id,
                created_at : before.created_at,
                updated_at : before.updated_at,
                categoryName : before.categoryName + ' ' +codeTenant[j],
                mpointchecklistpreventive : before.mpointchecklistpreventive
              }))

              editChecklistGrounding = listChecklistGrounding.map(before => ({
                id : before.id,
                created_at : before.created_at,
                updated_at : before.updated_at,
                categoryName : before.categoryName + ' ' +codeTenant[j],
                mpointchecklistpreventive : before.mpointchecklistpreventive
              }))

              editKwh = listPanelKwh.map(before => ({
                id: before.id,
                created_at: before.created_at,
                updated_at: before.updated_at,
                taskType: before.taskType,
                section: before.section,
                fabricator: before.fabricator,
                description: before.description,
                towerHeight: before.towerHeight,
                category: before.category + ' ' + codeTenant[j]
              }))
              editPANELACPDB = listPanelAcpdb.map(before => ({
                id: before.id,
                created_at: before.created_at,
                updated_at: before.updated_at,
                taskType: before.taskType,
                section: before.section,
                fabricator: before.fabricator,
                description: before.description,
                towerHeight: before.towerHeight,
                category: before.category + ' ' + codeTenant[j]
              }))
              editGrounding = listGrounding.map(before => ({
                id: before.id,
                created_at: before.created_at,
                updated_at: before.updated_at,
                taskType: before.taskType,
                section: before.section,
                fabricator: before.fabricator,
                description: before.description,
                towerHeight: before.towerHeight,
                category: before.category + ' ' + codeTenant[j]
              }))

              masterAsset.push(...editKwh)
              masterAsset.push(...editPANELACPDB)
              masterAsset.push(...editGrounding)

              masterChecklist.push(...editChecklistPanelKwh)
              masterChecklist.push(...editChecklistPANELACPDB)
              masterChecklist.push(...editChecklistGrounding)
              
            }

          }
          masterChecklist = masterChecklist.filter((e) => e.categoryName.toLowerCase() != 'panel kwh' && e.categoryName.toLowerCase() != 'panel acpdb' && e.categoryName.toLowerCase() != 'grounding & lightning protection system')
        }

        
        masterAsset = masterAsset.filter((e) => e.category != 'PANEL KWH' && e.category != 'PANEL ACPDB' && e.category != 'GROUNDING & LIGHTNING PROTECTION')
        
        res = {
          ...task,
          masterAsset,
          editKwh,
          masterChecklist,
          masterReportRegTorque
        }
        result.push(res)
      }else if(task.status == 'review' || task.status == 'accepted' || task.status == 'rejected'){
        var asset = await this.assetService.getData(task.id)
        
        res = {
          ...task,
          asset
        }
        result.push(res)
      }
    }

    return result
  }

  @Get('customGetTask')
  async customGetTask()
  {
    return this.service.getPreventiveTaskDistinct()

    
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, { name : 'createTask'})
  createTaskPreventive(){
    this.logger.log('create Task run')
    return this.service.getPreventiveTaskDistinct()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {name : 'updateStatus'})
  @Get('updateStatus')
  updateStatus(){
    this.logger.log('create Task update status run')
    return this.service.updateStatus()
  }

  @Get('customGetAll')
  async customGetAll(@Req() req: CrudRequest) {
    return await this.base.getManyBase(req);
  }

  // @Override('updateOneBase')
  // async updateTask(@Req() req: CrudRequest, @Body() data : Task){
  //   console.log(data)
  // }


  @Get('downloadPdf/:id')
  async downloadPDF(@Param('id') id: number, @Res() res){
    const data = await this.service.printPDF(id) 
    data.pipe(res)
    data.end()
   
  }

  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest){
    // return await this.base.deleteOneBase(req)
    const idTask = req.parsed.paramsFilter[0].value
    const task : Task = await this.service.getTaskFromId(idTask)
    if(task.status == 'todo'){
      return await this.base.deleteOneBase(req)
    }else{
      return this.service.deleteTaskCustom(task)
    }
    // return this.service.deleteTaskCustom(task)
  }
  @Delete('cancelUpload/:idTask')
  async cancelUpload(@Param('idTask') idTask : number){
    return this.service.failedUpload(idTask)
  }

  @Get('makerDoJob/:month')
  async makerDoJob(@Param('month') month: number){
    return this.service.getMakerDoJob(month)
  }
  // @Override()
  // updateOne(
  //   @ParsedRequest() req: CrudRequest,
  //   @ParsedBody() dto: Task,
  //   // @Req() request: Request,
  // ) {
  //   try {
  //     console.log(req.parsed.paramsFilter[0].value)
  //     console.log(dto)
  //     let year = Number.parseInt( dto.dueDate.split('-')[0])
  //     let month = Number.parseInt(dto.dueDate.split('-')[1])
  //     let date = Number.parseInt(dto.dueDate.split('-')[2])
  //     // const lastDueDate = new Date(year, month, date)
  //     // lastDueDate.setMonth(lastDueDate.getMonth() + 1)
  //     const lastDueDate = new Date(dto.dueDate)
  //     lastDueDate.setMonth(lastDueDate.getMonth() + 1)

  //     return lastDueDate
  //     // const accountId = getAccountId((request.headers as any).authorization);
  //     // return this.service.customUpdateOne(req, dto, { accountId });
  //   } catch (err) {
  //     throw new HttpException(
  //       err.message || err,
  //       err.statusCode || err.status || 500,
  //     );
  //   }
  // }
}


