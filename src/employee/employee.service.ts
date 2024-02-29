import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { LoginEmployeeDTO } from './dto/login-employee.dto';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class EmployeeService extends TypeOrmCrudService<Employee> {
  constructor(@InjectRepository(Employee) repo,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {
    super(repo)
  }

  customGetMany(req: CrudRequest) {
    console.log('service')
    console.log(req.parsed)
    return super.getMany(req)
  }

  create(user: CreateEmployeeDto): Observable<Employee> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new Employee
        newUser.nik = user.nik
        newUser.name = user.name
        newUser.email = user.email
        newUser.hp = user.hp
        newUser.role = user.role
        newUser.password = passwordHash
        newUser.isActive = user.isActive
        newUser.isVendor = user.isVendor
        newUser.urlEsign = user.urlEsign
        newUser.instansi = user.instansi

        return from(this.repo.save(newUser)).pipe(
          map((usr: Employee) => {
            const { password, ...result } = usr
            return result
          }),
          catchError(err => throwError(err))
        )
      })
    )
  }

  update(nik: string, user: CreateEmployeeDto): Observable<any> {
    try {
      console.log(user.password)
      if ( user.password != '') {
        console.log(' password')
        return this.authService.hashPassword(user.password).pipe(
          switchMap((passwordHash: string) => {
            const newUser = new Employee
            newUser.nik = user.nik
            newUser.name = user.name
            newUser.email = user.email
            newUser.hp = user.hp
            newUser.role = user.role
            newUser.password = passwordHash
            newUser.isActive = user.isActive
            newUser.isVendor = user.isVendor
            newUser.urlEsign = user.urlEsign
            newUser.instansi = user.instansi

            return from(this.repo.update(nik, newUser)).pipe(
              switchMap(() => this.findOneUser(nik))
            )
          })
        )
      } else {
        console.log(' no passworrd')
        const { password, ...result } = user
        return from(this.repo.update(nik, result)).pipe(
          switchMap(() => this.findOneUser(nik))
        )
      }
    } catch (error) {
      throwError(error)
    }

  }

  findOneUser(nik: string): Observable<Employee> {
    return from(this.repo.findOne({
      where: {
        nik
      },
    })).pipe(
      map((person: Employee) => {
        const { password, ...result } = person
        return result
      })
    );
  }
  
  findUserWithName(name: string): Observable<Employee> {
    return from(this.repo.findOne({where : {
      name : name
    } }))

  }

  findUserWithEmail(email: string): Observable<Employee| null > {
    return from(this.repo.findOne({where : {
      email : email
    } }))

  }
   async findWithEmail(email: string): Promise<Employee>{
    return await this.repo.findOne({
      where : {
        email : email
      }
    })
  }

  async findUserWithNik(nik: string): Promise<Employee> {
    return await (this.repo.findOne({where : {
      nik : nik
    } }))

  }

  validatePassword(password: string, passwordStore: string): Observable<boolean> {
    return this.authService.comparePassword(password, passwordStore)
  }

  login(data: LoginEmployeeDTO): Observable<string> {
    return this.findUserWithEmail(data.email).pipe(
      switchMap((user: Employee) => {
        if (user) {//user ditemukan
          if (user.password) {//password ada
            return this.validatePassword(data.password, user.password).pipe(
              switchMap((passwordMatches: boolean) => {
                if (passwordMatches) {//password betul
                  return this.findOneUser(user.nik).pipe(
                    switchMap((us: Employee) => this.authService.generateJWT(us))
                  )
                } else { //password salah
                  return '' + HttpStatus.UNAUTHORIZED
                }
              })
            )
          } else {// password ga ada

          }
        } else { //user tidak ditemukan
          return '' + HttpStatus.NOT_FOUND
        }
      })
    )
  }
}
