import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendResetPasswordEmail(emp: Employee, tokenReset : string){
        const folderenv = process.env.APP_PORT
        await this.mailerService.sendMail({
            to: emp.email,
            subject : 'Reset your password',
            template : './confirmation', 
            context : {
                emp : emp,
                tokenReset: tokenReset,
                link : `http://103.82.241.80:${folderenv}/employee/custom/resetPassword?token=${tokenReset}&nik=${emp.nik}`
            }
        })
    }
}
