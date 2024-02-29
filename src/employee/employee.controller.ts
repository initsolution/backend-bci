import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, UseInterceptors, UploadedFile, Res, Render, Query, Req, } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Observable, catchError, defaultIfEmpty, map, of, switchMap } from 'rxjs';
import { LoginEmployeeDTO } from './dto/login-employee.dto';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {run_shell_command} from '../function'
import { MailService } from 'src/mail/mail.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Crud({
  model: {
    type: Employee
  },
  params: {
    nik: {
      field: 'nik',
      type: 'string',
      primary: true
    }
  },
  dto: {
    create: CreateEmployeeDto,
    update: UpdateEmployeeDto
  },
  routes :{
    exclude : ['createManyBase',  'replaceOneBase']
  }
})
// @ApiBearerAuth()
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController implements CrudController<Employee> {
  constructor(public service: EmployeeService, 
    private mailService: MailService,
    private jwtService : JwtService
    ) { }

  get base(): CrudController<Employee> {
    return this;
  }
  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() person: CreateEmployeeDto): Observable<Employee | object> {
    return this.service.create(person).pipe(
      map((person: Employee) => person),
      catchError(err => of({ error: err }))
    )
  }

  // @UseGuards(JwtAuthGuard)
  @Override('updateOneBase')
  updateOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: UpdateEmployeeDto): Observable<any> {
    // console.log('update')
    // console.log(dto)
    // console.log(req.parsed.paramsFilter)
    const nik = req.parsed.paramsFilter.find(item => item.field === 'nik').value;
    // console.log(filterId)
    return this.service.update(nik, dto)
  }

  @Post('doResetPassword')
  async doResetPassword(@Body() data){
    console.log(data)
    var emp : CreateEmployeeDto ={
      nik : data.nik,
      password : data.password
    }
    const empCheck: Employee = await this.service.findUserWithNik(data.nik) 
    if(empCheck.tokenReset == data.token){
      return this.service.update(data.nik, emp).pipe(map((dt: Employee) => {
        if(dt){
          this.service.update(data.nik ,{
            nik : data.nik,
            tokenReset : null,
            password : ''
          })
          return 'Success change password'
        }
      }))
    }else{
      return 'Link tidak valid. Silahkan ulangi lagi'
    }
    
    
  }
  @Get('resetDataPassword/:email')
  async resetPassword(@Param('email') email: string, @Res() res : Response){

    const emp: Employee = await this.service.findWithEmail(email)
    // console.log(emp)
    if(emp){
      const tokenReset = Math.floor(Math.random() * 99999999) + 1000000 +''
      var updateToken : CreateEmployeeDto = {
        nik : emp.nik,
        tokenReset : tokenReset,
        password : ''
      }
      this.service.update(emp.nik, updateToken)
      this.mailService.sendResetPasswordEmail(emp, tokenReset)
      res.status(HttpStatus.ACCEPTED). send({
        message: `Your password has been reset. Please check your email : ${email} to setup new password. After that, you can login with new password`,
        statusCode: HttpStatus.ACCEPTED
      }) 
      
    }else{
      // console.log('null')
      res.status(HttpStatus.NOT_FOUND). send({
        message: 'Email not found',
        statusCode: HttpStatus.NOT_FOUND
      }) 
    }
    
    
    // return this.service.findUserWithEmail(email).pipe(
      
    //   map((emp: Employee) =>{
    //     console.log(' ada')
    //     console.log(emp)
    //     if(emp != null){
    //       return res.render('reset_password.hbs', {name : emp.name})
    //     }else{
    //       return {
    //         message: 'User tidak ditemukan',
    //         token_type: '-',
    //         statusCode: HttpStatus.NOT_FOUND
    //       }
    //     }
        
    //   }))
  }
  @Get('custom/resetPassword/')
  @Render('reset_password.hbs')
  async customResetPassword(@Query('token') token : string, @Query('nik') nik : string ){
    console.log(token)
    
    // const emp: Employee = await this.service.findWithEmail(email)
    return {nik : nik, token: token}
  }

  @Post('login')
  async login(@Body() data: LoginEmployeeDTO): Promise<Observable<object>> {
    return this.service.login(data).pipe(
      map((resp: string) => {
        if (resp == "1") {
          return {
            message: 'Password salah',
            token_type: '-',
            statusCode: HttpStatus.UNAUTHORIZED
          }
        } else if (resp == '4') {
          return {
            message: 'User tidak ditemukan',
            token_type: '-',
            statusCode: HttpStatus.NOT_FOUND
          }
        }
        return {
          message: resp,
          token_type: 'jwt',
          statusCode: HttpStatus.ACCEPTED
        }
      })
    )
  }

  // @UseGuards(JwtAuthGuard)
  @Override()
  async getMany(@ParsedRequest() req: CrudRequest, @Req() reqHeader: Request) {
    // console.log(req.parsed.filter)
    // console.log(req.parsed)
    // const jwt = reqHeader.headers.authorization
    // if(jwt != null){
    //   const jwtParsed :any = this.jwtService.decode(jwt.split(' ')[1]) 
    //   console.log(jwtParsed.employee)
    //   if(jwtParsed.employee.role != 'SuperAdmin'){
    //     console.log('bukan super admin')
    //     req.parsed.filter.push({
    //       field : 'role',
    //       operator : 'ne',
    //       value : 'SuperAdmin'
    //     })
    //   }
    // }
    
    // console.log(req.parsed)
    // const results: any = await this.base.getManyBase(req);
    const results: any = await this.service.customGetMany(req);
    
    
    let datas: any[];
    if (results.data) {
      datas = results.data;
    } else {
      datas = results;
    }
    let result: any =[]

    for(const dt of datas){
      delete dt.password
      result.push(dt)
    }
    return result
  }
  // @UseGuards(JwtAuthGuard)
  @Override('getOneBase')
  async getOneAndDoStuff(@ParsedRequest() req: CrudRequest) {
    let res: any = await this.base.getOneBase(req);
    delete res.password;
    return res
  }
  // @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/esign',
      filename: (_req, file, cb) => {
        // console.log(file.originalname)
        const filename: String = uuidv4()
        // const filename: String = 'myapk'
        // const extention: String = extname(file.originalname)
        cb(null, `${filename}.png`)
      }
    })
  }))
  @Patch('updateWithFile/:nik')
  async updateWithFile(@UploadedFile() file: Express.Multer.File,@Param('nik') id: string, @Body() dto: CreateEmployeeDto): Promise<Observable<any>> {
    
    dto.password = dto.password == undefined ? '' : dto.password
    dto.urlEsign = file.filename
    const empLama : Employee = await this.service.findUserWithNik(id)
    const scriptDelete = `rm uploads/esign/${empLama.urlEsign}`
    await run_shell_command(scriptDelete)
    return this.service.update(id, dto)
  }
  // @UseGuards(JwtAuthGuard)
  @Get('getImage/:id')
  async getImage(@Res() res, @Param('id') id: string): Promise<any> {
    
    const selectedBackground = await this.service.findUserWithNik(id)
    // return selectedBackground
    await res.sendFile(selectedBackground.urlEsign, {root: './uploads/esign'})
  }

  // @Get('kirimEmail/:nik/:message')
  // async kirimEmail(@Param('nik') nik : string, @Param('message') message : string) {
  //   const emp = await this.service.findUserWithNik(nik)
  //   return this.mailService.sendEmail(emp, message)
  // }

  
}
