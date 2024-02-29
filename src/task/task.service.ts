import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CustomFilterTaskDto } from './dto/custom-filter-task.dto';
import { Asset } from 'src/asset/entities/asset.entity';
import { Repository } from 'typeorm';
import PdfPrinter from 'pdfmake';
import { join } from 'node:path';
import { Column, Content, TDocumentDefinitions, TDocumentInformation, TableCell } from 'pdfmake/interfaces';
import { TenantService } from 'src/tenant/tenant.service';
import moment = require('moment');
import * as fs from 'fs';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { Categorychecklistpreventive } from 'src/categorychecklistpreventive/entities/categorychecklistpreventive.entity';
import { CategorychecklistpreventiveService } from 'src/categorychecklistpreventive/categorychecklistpreventive.service';
import { ReportregulertorqueService } from 'src/reportregulertorque/reportregulertorque.service';
import { ReportregulerverticalityService } from 'src/reportregulerverticality/reportregulerverticality.service';

@Injectable()
export class TaskService extends TypeOrmCrudService<Task>{
  constructor(
    @InjectRepository(Task) repo,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
    private readonly tenantService: TenantService,
    private readonly categoryChecklistPrevService: CategorychecklistpreventiveService,
    private readonly reportRegTorqueService: ReportregulertorqueService,
    private readonly reportRegVerticalityService: ReportregulerverticalityService

  ) {
    super(repo)
  }

  async getTaskFromId(id: number) {
    return await this.repo.findOne({
      where: {
        id: id
      },
      relations: ['categorychecklistprev', 'reportRegulerTorque', 'reportRegulerVerticality', 'asset',
        'categorychecklistprev.pointChecklistPreventive', 'reportRegulerVerticality.valueVerticality']
    })
  }

  async deleteTaskCustom(task: Task) {
    const folderenv = process.env.FOLDER_DESTINATION
    fs.rmSync(`./uploads/assets/${folderenv}/${task.id}`, { recursive: true, force: true })
    this.assetRepo.delete({
      task: {
        id: task.id
      }
    })
    if (task.type.toLowerCase() == 'preventive') {
      for (let i = 0; i < task.categorychecklistprev.length; i++) {
        const categorychecklistprev = task.categorychecklistprev[i]
        this.categoryChecklistPrevService.deleteData(categorychecklistprev)
      }
      return this.repo.delete({ id: task.id })
    } else {
      this.reportRegTorqueService.deleteData(task.id)
      this.reportRegVerticalityService.deleteData(task.id, task.reportRegulerVerticality)

    }
    return this.repo.delete({ id: task.id })
  }

  async failedUpload(idTask: number) {
    const folderenv = process.env.FOLDER_DESTINATION
    fs.rmSync(`./uploads/assets/${folderenv}/${idTask}`, { recursive: true, force: true })
    const task: Task = await this.getTaskFromId(idTask)
    // if(task.type.toLowerCase() == 'preventive'){
    //   for (let i = 0; i < task.categorychecklistprev.length; i++) {
    //     const categorychecklistprev = task.categorychecklistprev[i]
    //     this.categoryChecklistPrevService.deleteData(categorychecklistprev)
    //   }
    //   return this.repo.delete({id : task.id})
    // }else{
    //   this.reportRegTorqueService.deleteData(task.id)
    //   this.reportRegVerticalityService.deleteData(task.id, task.reportRegulerVerticality)

    // }
    return this.assetRepo.delete({
      task: {
        id: idTask
      }
    })
  }


  async updateCustomTask(task: Task) {
    return await this.repo.update(task.id, task)
  }

  async createCustomTask(task: Task) {
    const dt = this.repo.create(task)
    return await this.repo.save(dt)
  }

  async getAllCustomTask(dto: CustomFilterTaskDto) {
    return await this.repo.find({
      where: {
        makerEmployee: {
          email: dto.emailMakerEmployee
        },
        verifierEmployee: {
          email: dto.emailVerifierEmployee
        },

      }
    })
  }

  async updateStatus(){
   const dateNow = moment().format('YYYY-MM-DD') 
   var fullTask: Task[] = []
   await this.repo.createQueryBuilder('task')
    .where('task.status = :status', { status : 'todo'})
    .andWhere('task.dueDate < :dateNow', {dateNow : dateNow})
    .getMany()
    .then((dataJadi) => {
      fullTask = dataJadi
    })

    for(let i =0; i< fullTask.length; i++){
      let updateTask = fullTask[i]
      updateTask.status = 'expired'
      await this.repo.update(updateTask.id, updateTask)
    }
    return fullTask
  }

  async getPreventiveTaskDistinct() {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    var fullTask: Task[] = []
    await this.repo.createQueryBuilder('task')
      // .select('task.*')
      // .distinctOn(['task.site.id'])
      .where('task.type = :type', { type: 'Preventive' })
      .leftJoinAndSelect('task.site', 'site')
      .leftJoinAndSelect('task.makerEmployee', 'makerEmployee')
      .leftJoinAndSelect('task.verifierEmployee', 'verifierEmployee')

      .orderBy({
        'task.created_at': 'DESC'
      })
      .getMany().then((dataJadi) => {
        fullTask = dataJadi

      })

    let data = new Map();
    for (let obj of fullTask) {
      data.set(obj.site.id, obj);
    }
    const out: Task[] = [...data.values()];
    let newTaskJoin: Task[] = []
    for (let index = 0; index < out.length; index++) {
      const task: Task = out[index]
      if (task.status == 'todo') {
        let updateTask = task
        updateTask.status = 'expired'
        await this.repo.update(task.id, updateTask)
      }

      const submitDate = moment(task.submitedDate, "YYYY-MM-DD")
      const submitDateAdd20 = submitDate.add(20, 'days')

      const notBefore = task.submitedDate == '' ? null : submitDate.month() == submitDateAdd20.month() ? startOfMonth : submitDateAdd20.format('YYYY-MM-DD')

      var newTask: Task = {
        created_at: moment(startOfMonth).toDate(),
        dueDate: endOfMonth,
        submitedDate: '',
        verifiedDate: '',
        notBefore: notBefore,
        status: 'todo',
        type: task.type,
        towerCategory: task.towerCategory,
        makerEmployee: task.makerEmployee,
        verifierEmployee: task.verifierEmployee,
        site: task.site,
        categorychecklistprev: [],
        reportRegulerTorque: [],
        reportRegulerVerticality: new Reportregulerverticality,
        asset: new Asset
      }
      // console.log(newTask)
      newTaskJoin.push(newTask)
    }
    const createNewTask = this.repo.create(newTaskJoin)
    return this.repo.save(createNewTask)
  }


  // mendapatkan total job yang todo, review, verified dan not verified bedasrkan bulan tertentu
  async getMakerDoJob(month: number) {
    let queryMaker = `
    select  
    distinct (t."makerEmployeeNik") as nik,
    e."name" ,
    count((case when t.status = 'todo' then t."makerEmployeeNik" else null end) ) as todoCount ,
    count((case when t.status = 'review' then t."makerEmployeeNik" else null end) ) as reviewCount ,
    count((case when t.status = 'verified' then t."makerEmployeeNik" else null end) ) as verifiedCount ,
    count(t."makerEmployeeNik" ) as taskCount 
    from public."Task" t inner join public."Employee" e 
    on t."makerEmployeeNik" = e.nik 
    where date_part('month', t.created_at) = ${month}
    group by t."makerEmployeeNik", e."name" ;
    `
    const getMaker = await this.repo.query(queryMaker)
    let queryVerifikator = `
    select  
    distinct (t."verifierEmployeeNik") as nik,
    e."name" ,
    count((case when t.status = 'todo' then t."verifierEmployeeNik" else null end) ) as todoCount ,
    count((case when t.status = 'review' then t."verifierEmployeeNik" else null end) ) as reviewCount ,
    count((case when t.status = 'verified' then t."verifierEmployeeNik" else null end) ) as verifiedCount ,
    count(t."verifierEmployeeNik" ) as taskCount 
    from public."Task" t inner join public."Employee" e 
    on t."verifierEmployeeNik" = e.nik 
    where date_part('month', t.created_at) = ${month}
    group by t."verifierEmployeeNik", e."name" ;
    `
    const getVerifier = await this.repo.query(queryVerifikator)


    // const getMaker = await this.repo.createQueryBuilder('t')
    //   .select('')
    //   .distinctOn(['t.makerEmployeeNik'])
    return {
      maker: getMaker,
      verifier: getVerifier
    }
  }

  async printPDF(id: number): Promise<PDFKit.PDFDocument> {
    const folderenv = process.env.FOLDER_DESTINATION

    const task: Task = await this.repo.findOne({
      where: {
        id: id
      },
      relations: ['site', 'makerEmployee', 'verifierEmployee', 'categorychecklistprev',
        'categorychecklistprev.pointChecklistPreventive',
        'reportRegulerTorque',
        'reportRegulerVerticality',
        'reportRegulerVerticality.valueVerticality']
    })
    // console.log(task)


    let getCategoryAsset = await this.assetRepo.createQueryBuilder('asset')
      .select('asset.category')
      .addSelect('asset.orderIndex')
      .distinctOn(['asset.category'])
      .where(`asset.taskId = :id`, { id: id })
      // .orderBy({'asset.orderIndex' : 'ASC', 'asset.id' : 'ASC'})
      .getMany()
    // const pathLocal = '/home/project/balcom/backend/src/task'
    const pathLocal = '/home/project/balcom/backend/assets'
    getCategoryAsset = getCategoryAsset.sort((a, b) => a.orderIndex - b.orderIndex)
    // console.log(getCategoryAsset)
    const path_fonts = join(pathLocal, 'fonts')
    const path_icon = join(pathLocal, 'image')
    const fontSize = 10
    const fonts = {
      Roboto: {
        normal: path_fonts + '/Roboto-Regular.ttf',
        bold: path_fonts + '/Roboto-Medium.ttf',
        italics: path_fonts + '/Roboto-Italic.ttf',
        bolditalics: path_fonts + '/Roboto-MediumItalic.ttf'
      }
    }
    const path_image = `./uploads/assets/${folderenv}/${task.id}/`
    const path_esign = './uploads/esign/'

    let dataTenant = ''
    if (task.site.tenants != '') {
      var kodeTenant = task.site.tenants.split(',')
      if (kodeTenant.length > 0) {
        for (let j = 0; j < kodeTenant.length; j++) {
          dataTenant += (await this.tenantService.getTenantByKode(kodeTenant[j])).name
          if (j < kodeTenant.length - 1) {
            dataTenant += ','
          }
        }
      } else {
        this.tenantService.getTenantByKode(task.site.tenants).then((data) => {
          const str: string = data.name;
          dataTenant = str
        })
      }
    }
    // console.log(dataTenant)
    let dataRender: Content
    dataRender = []
    dataRender.push(
      {
        image: path_icon + '/logo.png',
        width: 150,
        height: 55,
      }
    )
    dataRender.push([
      {
        columns : [
          {width: '*', text : '\n\n\n\n'},
        ]
      }
    ])
    dataRender.push([
      {
        columns : [
          {width: '*', text : ''},
          {width: 'auto', text : task.type.toLocaleLowerCase() == 'preventive' ? 'REPORT PREVENTIVE MAINTENANCE' : 'REPORT REGULER MINI TII', style: 'headerTitle'},
          {width: '*', text : ''},
        ]
      }
    ])
    dataRender.push([
      {
        columns : [
          {width: '*', text : '\n\n'},
        ]
      }
    ])
    dataRender.push([
      {
        columns : [
          {width: '*', text : ''},
          {width: 'auto', text : moment(task.submitedDate).format('MMMM YYYY') , style: 'headerTitle'},
          {width: '*', text : ''},
        ]
      }
    ])
    dataRender.push([
      {
        columns : [
          {width: '*', text : '\n\n\n\n\n'},
        ]
      }
    ])
    dataRender.push([

      {
        columns : [
          { width: '*', text: '' },
          {
            width: 'auto',
            alignment: 'left',
            layout: 'noBorders',
            table: {
              body: [
                [{ text: 'SITE ID',  style: 'header' },{text: ':', style: 'header'}, { text: task.site.id,  style: 'header' }],
                [{ text: 'SITE NAME', style: 'header' }, {text: ':', style: 'header'},{ text: task.site.name,  style: 'header' }],
                [{ text: 'AREA / REGION',  style: 'header' }, {text: ':', style: 'header'},{ text: task.site.region,  style: 'header' }],
                [{ text: 'TOWER HEIGHT',  style: 'header' }, {text: ':', style: 'header'},{ text: task.site.towerHeight + 'M', style: 'header' }],
                [{ text: 'FABRICATOR', style: 'header' }, {text: ':', style: 'header'}, { text: task.site.fabricator, style: 'header' }],
                [{ text: 'OPERATOR',  style: 'header' }, {text: ':', style: 'header'}, { text: dataTenant,  style: 'header' }],
                [{ text: 'CREATED DATE',  style: 'header' }, {text: ':', style: 'header'},{ text: moment(task.created_at).format('DD-MM-YYYY'),  style: 'header' }],
                [{ text: 'ACCEPTANCE DATE',  style: 'header' }, {text: ':', style: 'header'},{ text: moment(task.verifiedDate).format('DD-MM-YYYY'),  style: 'header' }],
                [{ text: 'DUE DATE', style: 'header' }, {text: ':', style: 'header'},{ text: moment(task.dueDate).format('DD-MM-YYYY'),  style: 'header' }],
                [{ text: 'PIC NAME',  style: 'header' }, {text: ':', style: 'header'},{ text: task.makerEmployee.name,  style: 'header' }],
              ]
            },
          },
          
          { width: '*', text: '' },
        ]
        
        
      },

    ])
    // dataRender.push([

    //   {
    //     columns : [
    //       { width: '*', text: '' },
    //       {
    //         width: 'auto',
    //         alignment : 'center',
    //         layout: 'noBorders',
    //         table : {
              
    //           body : [
    //             [task.type.toLocaleLowerCase() == 'preventive' ? {
    //               alignment: 'left',
    //               table: {
    //                 body: [
    //                   [{ text: 'OPERATOR', border: [true, true, false, false], style: 'header' }, { text: dataTenant, border: [false, true, true, false], style: 'header' }],
    //                   [{ text: 'CREATED DATE', border: [true, false, false, false], style: 'header' }, { text: moment(task.created_at).format('DD-MM-YYYY'), border: [false, false, true, false], style: 'header' }],
    //                   [{ text: 'ACCEPTANCE DATE', border: [true, false, false, false], style: 'header' }, { text: moment(task.submitedDate).format('DD-MM-YYYY'), border: [false, false, true, false], style: 'header' }],
    //                   [{ text: 'DUE DATE', border: [true, false, false, false], style: 'header' }, { text: moment(task.dueDate).format('DD-MM-YYYY'), border: [false, false, true, false], style: 'header' }],
    //                   [{ text: 'PIC NAME', border: [true, false, false, true], style: 'header' }, { text: task.makerEmployee.name, border: [false, false, true, true], style: 'header' }],
    //                 ]
    //               },
    //               } : {
    
    //               alignment: 'left',
    //               table: {
    //                 body: [
    //                   [{ text: 'CREATED DATE', border: [true, true, false, false], style: 'subHeader' }, { text: moment(task.created_at).format('DD-MM-YYYY'), border: [false, true, true, false], style: 'subHeader' }],
    //                   [{ text: 'ACCEPTANCE DATE', border: [true, false, false, false], style: 'subHeader' }, { text: moment(task.submitedDate).format('DD-MM-YYYY'), border: [false, false, true, false], style: 'subHeader' }],
    //                   [{ text: 'DUE DATE', border: [true, false, false, false], style: 'subHeader' }, { text: moment(task.dueDate).format('DD-MM-YYYY'), border: [false, false, true, false], style: 'subHeader' }],
    //                   [{ text: 'PIC NAME', border: [true, false, false, true], style: 'subHeader' }, { text: task.makerEmployee.name, border: [false, false, true, true], style: 'subHeader' }],
    //                 ]
    //               },
    //             }]
    //           ]
    //         }
    //       },
    //       { width: '*', text: '' },
    //     ]
    //   }
      
    // ])


    let esign_maker = task.makerEmployee.urlEsign != null ? path_esign + task.makerEmployee.urlEsign : null
    let esign_verifikator = task.verifierEmployee.urlEsign != null ? path_esign + task.verifierEmployee.urlEsign : null

    if (esign_maker != null) {
      if (!fs.existsSync(esign_maker)) esign_maker = null

    }
    if (esign_verifikator != null) {
      if (!fs.existsSync(esign_verifikator)) esign_verifikator = null
    }

    
    dataRender.push({
      text: '',
      pageBreak: 'after',
    })

    // dataRender.push({
    //   text: '\n\n\n\n',
      
    // })
    if (task.type.toLocaleLowerCase() == 'preventive') {
      var categoryIdx = 0
      let dataBody = []
      const categoryChecklistPreventive = (task.categorychecklistprev).sort((a, b) => a.orderIndex - b.orderIndex)
      for (let i = 0; i < categoryChecklistPreventive.length; i++) {
        const dataCategory = categoryChecklistPreventive[i];
        dataBody.push([
          
          {
            text: String.fromCharCode(categoryIdx + 'A'.charCodeAt(0)),
            color: '#FFFFFF',
            fillColor: '#963634', style: 'subHeader'
          },
          {
            text: dataCategory.nama,
            color: '#FFFFFF',
            fillColor: '#963634', style: 'subHeader'
          },
          {
            text: '',
            fillColor: '#963634'
          },
          {
            text: '',
            fillColor: '#963634'
          },
          {
            text: '',
            fillColor: '#963634'
          },
          {
            text: '',
            fillColor: '#963634'
          },
          {
            text: '',
            fillColor: '#963634'
          }
        ])

        const pointchecklist = (dataCategory.pointChecklistPreventive).sort((a, b) => a.orderIndex - b.orderIndex)
        for (let j = 0; j < pointchecklist.length; j++) {
          const dataPoint = pointchecklist[j];
          dataBody.push(dataPoint.isChecklist ? [
            {
              text: (dataPoint.orderIndex + 1), style: 'subHeader'
            },
            {
              text: dataPoint.uraian, style: 'subHeader'
            },
            {
              text: dataPoint.kriteria, style: 'subHeader'
            },
            dataPoint.hasil.toLowerCase() == 'ok' ? {
              image: path_icon + '/ok.png',
              height: 10,
              width: 10,
            } : {
              text: ''
            },
            dataPoint.hasil.toLowerCase() == 'notok' ? {
              image: path_icon + '/ok.png',
              height: 10,
              width: 10,
            } : {
              text: ''
            },
            dataPoint.hasil.toLowerCase() == 'na' ? {
              image: path_icon + '/ok.png',
              height: 10,
              width: 10,
            } : {
              text: ''
            },
            {
              text: dataPoint.keterangan, style: 'subHeader'
            }
          ] :
            [
              {
                text: '',
                color: '#FFFFFF',
                fillColor: '#963634'
              },
              {
                text: dataPoint.uraian,
                color: '#FFFFFF',
                fillColor: '#963634', style: 'subHeader'
              },
              {
                text: dataPoint.kriteria,
                color: '#FFFFFF',
                fillColor: '#963634', style: 'subHeader'
              },
              {
                text: '',
                color: '#FFFFFF',
                fillColor: '#963634'
              },
              {
                text: '',
                color: '#FFFFFF',
                fillColor: '#963634'
              },
              {
                text: '',
                color: '#FFFFFF',
                fillColor: '#963634'
              },
              {
                text: '',
                color: '#FFFFFF',
                fillColor: '#963634'
              }
            ]
          )

        }
        categoryIdx++
      }
      let tableHeader: Content = {
        alignment: 'center',
        
        
        table: {
          
          body: [
            [{
              text: 'No',
              color: '#FFFFFF', fillColor: '#002060', rowSpan: 2, alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Uraian',
              color: '#FFFFFF', fillColor: '#002060', rowSpan: 2, alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Kriteria',
              color: '#FFFFFF', fillColor: '#002060', rowSpan: 2, alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Hasil',
              fillColor: '#ffff00',
              colSpan: 3, style: 'subHeader', aligment: 'center'
            }, '', '',
            {
              text: 'Keterangan',
              color: '#FFFFFF', fillColor: '#002060', rowSpan: 2, style: 'subHeader'
            }],
            ['', '', '', { text: 'OK', fillColor: '#ffff00', style: 'subHeader' },
              { text: 'NOK', fillColor: '#ffff00', style: 'subHeader' },
              { text: 'NA', fillColor: '#ffff00', style: 'subHeader' }, ''],
            ...dataBody
          ]
        }
      }
      dataRender.push(tableHeader)
    } else if (task.type.toLocaleLowerCase() == 'reguler') {
      let dataBody = []
      const reportRegulerTorque = (task.reportRegulerTorque).sort((a, b) => a.orderIndex - b.orderIndex)
      for (let i = 0; i < reportRegulerTorque.length; i++) {
        const torque = reportRegulerTorque[i];
        dataBody.push([
          {
            text: (torque.orderIndex + 1), style: 'subHeader'
          },
          {
            text: torque.towerSegment, style: 'subHeader'
          },
          {
            text: torque.elevasi, style: 'subHeader'
          },
          {
            text: torque.boltSize, style: 'subHeader'
          },
          {
            text: torque.minimumTorque, style: 'subHeader'
          },
          {
            text: torque.qtyBolt, style: 'subHeader'
          },
          {
            text: torque.remark, style: 'subHeader'
          },
        ])
      }

      let tableTorque: Content = {
        alignment: 'center',
        table: {
          body: [
            [{
              text: 'No',
              color: '#FFFFFF', fillColor: '#002060', alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Tower Segment/Section',
              color: '#FFFFFF', fillColor: '#002060', alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Elevasi (Mm)',
              color: '#FFFFFF', fillColor: '#002060', alignment: 'center', style: 'subHeader'
            },
            {
              text: 'Bolt Size (Dia. Mm)',
              color: '#FFFFFF', fillColor: '#002060', alignment: 'center', style: 'subHeader'

            },
            {
              text: 'Minimum Torque',
              color: '#FFFFFF', fillColor: '#002060', style: 'subHeader'
            },
            {
              text: 'Qty Bolt',
              color: '#FFFFFF', fillColor: '#002060', style: 'subHeader'
            },
            {
              text: 'Remarks',
              color: '#FFFFFF', fillColor: '#002060', style: 'subHeader'
            }
            ],

            ...dataBody
          ]
        }
      }
      dataRender.push({
        text: 'BOLT TIGHTENING TORQUE', style: 'header', alignment: 'center'
      })
      dataRender.push(tableTorque)
      dataRender.push({
        text: '',
        pageBreak: 'after'
      } as Content)
      dataRender.push({
        text: 'DATA HASIL PENGUKURAN KETEGAKAN MENARA (VERTICALITY) \n', style: 'header', alignment: 'center'
      })

      dataRender.push({
        text: '1. Horizontality\n', style: 'header', alignment: 'left'
      })
      const reportRegulerVerticality = task.reportRegulerVerticality
      let ab = ''
      let bc = ''
      let cd = ''
      let da = ''
      switch (reportRegulerVerticality.theodolite1) {
        case 'A-B':
          ab = '1'
          break;
        case 'B-C':
          bc = '1'
          break;
        case 'C-D':
          cd = '1'
          break;
        case 'D-A':
          da = '1'
          break;
        default:
          break;
      }
      switch (reportRegulerVerticality.theodolite2) {
        case 'A-B':
          ab = '2'
          break;
        case 'B-C':
          bc = '2'
          break;
        case 'C-D':
          cd = '2'
          break;
        case 'D-A':
          da = '2'
          break;
        default:
          break;
      }
      let horizontality: Content = {
        alignment: 'justify',
        columns: [
          {
            alignment: 'left',
            stack: ['AB : ' + reportRegulerVerticality.horizontalityAb + ' MM',
            'BC : ' + reportRegulerVerticality.horizontalityBc + ' MM',
            'CD : ' + reportRegulerVerticality.horizontalityCd + ' MM',
            'DA : ' + reportRegulerVerticality.horizontalityDa + ' MM'
            ],

          },
          {
            alignment: 'center',
            table: {

              body: [
                ['', ab, ''],
                [{
                  text: da,
                  margin: [35, 0],
                  alignment: 'right'
                }, {
                  image: path_icon + '/tower.png',
                  width: 100,
                  height: 100,
                }, {
                  text: '\n\n\n' + bc,
                  margin: [35, 0],
                  alignment: 'left'
                }],
                ['', cd, '']
              ]
            },
            layout: 'noBorders'
          }
        ]
      }
      dataRender.push(horizontality)
      dataRender.push({
        text: '\n'
      })
      dataRender.push({
        text: '2. Verticality\n', style: 'header', alignment: 'left'
      })
      const listThedolite1 = reportRegulerVerticality.valueVerticality.filter((el) => el.theodoliteIndex == 1)
      let dataTheodolite1 = []
      for (let i = 0; i < listThedolite1.length; i++) {
        const valueVerticality = listThedolite1[i];
        dataTheodolite1.push([
          { text: valueVerticality.section },
          { text: 'Sisi ' + valueVerticality.miringKe },
          { text: valueVerticality.value }])
      }
      let tableTheodolite1: Content = {
        alignment: 'center',
        table: {
          body: [
            [{ text: 'Theodolite 1', fillColor: '#ffff00', colSpan: 3 }, '', ''],
            [{ text: 'Section' }, { text: 'Miring ke ' + reportRegulerVerticality.theodolite1 }, { text: 'MM' }],
            ...dataTheodolite1
          ]
        }
      }

      const listThedolite2 = reportRegulerVerticality.valueVerticality.filter((el) => el.theodoliteIndex == 2)
      let dataTheodolite2 = []
      for (let i = 0; i < listThedolite2.length; i++) {
        const valueVerticality = listThedolite2[i];
        dataTheodolite2.push([{
          text: valueVerticality.section
        },
        {
          text: 'Sisi ' + valueVerticality.miringKe
        },
        {
          text: valueVerticality.value
        }])
      }
      let tableTheodolite2: Content = {
        alignment: 'center',
        table: {
          body: [
            [{ text: 'Theodolite 2', fillColor: '#ffff00', colSpan: 3 }, '', ''],
            [{ text: 'Section', }, { text: 'Miring ke ' + reportRegulerVerticality.theodolite2, }, { text: 'MM' }],
            ...dataTheodolite2
          ]
        },

      }


      let theodoliteRender: Content = {
        alignment: 'center',
        columns: [

          tableTheodolite1,
          tableTheodolite2
        ]

      }
      dataRender.push(theodoliteRender)
      dataRender.push({
        text: '\n'
      })
      dataRender.push([

        { text: '3. Jenis alat ukur yang digunakan ' + reportRegulerVerticality.alatUkur, style: 'header', alignment: 'left' },
        { text: '4. Toleransi ketegakan menara ' + reportRegulerVerticality.toleransiKetegakan + ' MM', style: 'header', alignment: 'left' },
      ])
    }
    dataRender.push({
      text: '',
      pageBreak: 'after'
    } as Content)

    // dataRender.push({
    //   alignment : 'center',
    //   columns : [
    //     {
    //       stack : [
    //         {text : 'Verifikator'},
    //         esign_verifikator != null ? { image : esign_verifikator, width : 50, height : 50, alignment : 'center'} : {text : '', width :50, height : 50},
    //         {text : task.verifierEmployee.name}
    //       ]
    //     },
    //     {
    //       stack : [
    //         {text : 'Maker'},
    //         esign_maker != null ? { image : esign_maker, width : 50, height : 50, alignment : 'center'} : {text : '', width :50, height : 50},
    //         {text : task.makerEmployee.name}
    //       ]
    //     }
    //   ]
    // })

    // dataRender.push({
    //   text: '',
    //   pageBreak: 'after'
    // } as Content)

    for (let i = 0; i < getCategoryAsset.length; i++) {
      const groupedCategory = getCategoryAsset[i].category;
      let head: Content = { text: groupedCategory, style: 'header', margin: [0, 30], }
      let heightImage = 180
      let widthImage = 140
      if(groupedCategory.toLocaleLowerCase().match('panel kwh') || 
      groupedCategory.toLocaleLowerCase().match('panel acpdb') ||
      groupedCategory.toLocaleLowerCase().match('grounding & ')
      ){
        heightImage = 140
        widthImage = 120
      }
      // dataRender.push(head)
      const assets: Asset[] = await this.assetRepo.find({
        where: {
          task: {
            id: id
          },
          category: groupedCategory
        },
        order: {
          orderIndex: "ASC"
        }
      })
      let assetRender = []
      
      for (let j = 0; j < assets.length; j++) {
        let data = [
          {
            
            stack: [
              {
                image: path_image + assets[j].url,
                alignment: 'center',
                height: heightImage,
                width: widthImage,
              },
              { text: '\n' },
              {
                text: assets[j].description ?? '',
                alignment: 'center',
                fontSize: 10
              }
            ]
          },
          (j + 1 < assets.length) ? {
            stack: [
              {
                image: path_image + assets[j + 1].url,
                alignment: 'center',
                height: heightImage,
                width: widthImage,
              },
              { text: '\n' },
              {
                text: assets[j + 1].description ?? '',
                alignment: 'center',
                fontSize: 10
              }
            ],

          } : null,

        ];
        j += 1
        assetRender.push(data)
      }

      let tableHeader: Content = {
        alignment: 'center',
        
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: head, fillColor: '#ffff00', colSpan: 2 }, '',],
            ...assetRender
          ]
        }
      }
      dataRender.push(tableHeader)
      if (i < getCategoryAsset.length - 1) {
        dataRender.push({
          text: '',
          pageBreak: 'after'
        } as Content)
      }

    }


    const printer = new PdfPrinter(fonts)
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      content: dataRender,
      footer: function (currentPage: number, pageCount: number) {
        if(currentPage == 1){
          return {
            table: {
              widths: ['*', '*'],
              body: [
                [{ text: 'Verifikator' }, { text: 'Maker' }],
                [esign_verifikator != null ? { image: esign_verifikator, width: 100, height: 100, alignment: 'center' } : { text: '', },
                esign_maker != null ? { image: esign_maker, width: 100, height: 100, alignment: 'center' } : { text: '', },],
                [{ text: task.verifierEmployee.name }, { text: task.makerEmployee.name }]
              ]
            },
            layout: 'noBorders',
            margin : [0, -150],
            alignment : 'center'
          } as Content
        }else{
          return { text: task.site.id + ' - ' + currentPage.toString(), style: 'footerStyle' } as Content
        }

        
      },
      header : function(currentPage: number, pageCount: number){
        if(currentPage != 1){
          return {
            alignment: 'justify',
            columns : [
              {  
                width: 'auto',
                alignment: 'left',
                margin : [30, 5],
                
                table: {
                  body: [
                    [{ text: 'SITE ID', border: [true, true, false, false], style: 'headerStyle' }, { text: task.site.id, border: [false, true, true, false], style: 'headerStyle' }],
                    [{ text: 'SITE ADDRESS',border: [true, false, false, false], style: 'headerStyle' }, { text: task.site.address, border: [false, false, true, false], style: 'headerStyle' }],
                    [{ text: 'SITE NAME', border: [true, false, false, true], style: 'headerStyle' }, { text: task.site.name, border: [false, false, true, true], style: 'headerStyle' }],
                    
                  ]
                },
              },
              
              {
                width: '*',
                alignment: 'right',
                margin : [155,5,0,0],
                table: {
                  body: [
                    [{ text: 'REGION', border: [true, true, false, false],style: 'headerStyle' }, { text: task.site.region, border: [false, true, true, false],style: 'headerStyle' }],
                    [{ text: 'TYPE', border: [true, false, false, false],style: 'headerStyle' }, { text: task.type.toUpperCase(), border: [false, false, true, false],style: 'headerStyle' }],
                    [{ text: 'TENNANT',  border: [true, false, false, false], style: 'headerStyle' }, { text: dataTenant, border: [false, false, true, false],style: 'headerStyle' }],
                    [{ text: 'DATE',  border: [true, false, false, true], style: 'headerStyle' }, { text: moment(task.submitedDate).format('DD-MM-YYYY'), border: [false, false, true, true],style: 'headerStyle' }],
                  ]
                },
              }
            ]
          }
        }
      },
      pageMargins: [ 40, 60, 40, 60 ],
      styles: {
        headerTitle: {
          fontSize: 18,
          bold: true
        },
        header: {
          fontSize: 12,
          bold: true
        },
        subHeader: {
          fontSize: 8,
          alignment: 'left'
        },
        bigger: {
          fontSize: 15,
          italics: true
        },
        centerGravity: {
          alignment: 'center'
        },
        footerStyle: {
          fontSize: 8,
          alignment: 'center'
        },
        headerStyle: {
          fontSize: 6,
          alignment: 'left'
        },
      }
    }
    const options = {}
    return printer.createPdfKitDocument(docDefinition, options)

    // return {
    //   'task' :task,
    //   'asset':asset
    // }
  }

}
