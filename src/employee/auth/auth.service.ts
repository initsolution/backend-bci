import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../entities/employee.entity';


const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
    constructor(private readonly jwtService : JwtService,
        @Inject(forwardRef(()=> EmployeeService))
        private employeeService: EmployeeService
        ){}

        hashPassword(password: string) : Observable<string> {
            return from<string> (bcrypt.hash(password, 12))
        }
        
        comparePassword(newPassword: string, passwordHash :string): Observable<any | boolean >{
            return of<any | boolean> (bcrypt.compareSync(newPassword, passwordHash))
        }
        
        generateJWT(employee: Employee) : Observable<string>{ 
            return from(this.jwtService.signAsync({employee}))
        }

        async validateEmployee(email: string, pass: string): Promise<any> {
            const user = await this.employeeService.findOne({where : {email : email}});
            if (user && user.password === bcrypt.hash(pass, 12)) {
              const { password, ...result } = user;
              return result;
            }
            return null;
          }
}
