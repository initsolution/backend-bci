import { Module, forwardRef } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [TypeOrmModule.forFeature([Employee]), forwardRef(()=> AuthModule), MailModule, JwtModule ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports :[EmployeeService]
})
export class EmployeeModule {}
