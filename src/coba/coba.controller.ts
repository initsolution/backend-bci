import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Inject, Injectable, Scope, Logger, Render } from '@nestjs/common';
import { CobaService } from './coba.service';
import { CreateCobaDto } from './dto/create-coba.dto';
import { UpdateCobaDto } from './dto/update-coba.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron'
import moment = require('moment');
let fs = require('fs-extra');


@ApiTags('coba')
@Controller({
  path: 'coba',

})
export class CobaController {
  constructor(private readonly cobaService: CobaService,
    private schedulerRegistry: SchedulerRegistry
  ) { }

  private readonly logger = new Logger(CobaController.name);

  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'x-custom-destination',
    description: 'untuk folder upload'
  })
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const getHeader = req.headers['x-custom-destination'] || ''
        console.log(getHeader)
        const customDestination = './uploads/coba/' + getHeader;
        fs.mkdirsSync(customDestination)
        callback(null, customDestination);
      },
      filename: (req, file, callback) => {
        console.log(`file name : ${file.originalname}`)
        const filename: String = uuidv4()
        //   const uniqueFileName = Date.now() + '-' + file.originalname;
        callback(null, `${filename}.jpg`);
      },
    }),
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateCobaDto) {
    // return this.cobaService.create(createCobaDto);

    console.log(file)
    return 'File upload success'
  }


  // @Get('crontab/:name')
  // crontab(@Param('name') name: string) {
  //   const job = new CronJob(CronExpression.EVERY_10_SECONDS, () => {
  //     this.logger.warn(`TIME ${CronExpression.EVERY_10_SECONDS} for job ${name} to run!`)
  //   })
  //   this.schedulerRegistry.addCronJob(name, job)
  //   job.start()
  //   this.logger.warn(
  //     `job ${name} added for each minute at ${CronExpression.EVERY_10_SECONDS} seconds!`,
  //   );
  // }

  @Get('crontab/list')
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    let data = []
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      data.push({
        job : key,
        date :  next
      })
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
    return data
  }

  

  // @Cron(CronExpression.EVERY_10_SECONDS, { name: 'coba10' })
  // handleCron() {
  //   this.logger.debug(`job coba10 added for each minute at ${CronExpression.EVERY_10_SECONDS} seconds!`);
  // }

  // @Get('stopcronjob/:name')
  // stopcronjob(@Param('name') name: string) {
  //   const job = this.schedulerRegistry.getCronJob(name);

  //   job.stop();
  //   console.log(job.lastDate());
  // }

  @Get('getLastEndMonth')
  getLastEndMonth(){
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
    return {
      startMonth : startOfMonth,
      endOfMonth : endOfMonth
    }
  }

  @Get()
  findAll() {
    return this.cobaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cobaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCobaDto: UpdateCobaDto) {
    return this.cobaService.update(+id, updateCobaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cobaService.remove(+id);
  }
}


