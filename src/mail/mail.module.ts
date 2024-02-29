import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'node:path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports : [
    MailerModule.forRoot({
      transport : {
        service: 'gmail',
        host  : 'smtp.mail.yahoo.com',
        port: 587,
        secure: false,
        auth : {
          user : 'initsolutions22@gmail.com',
          pass : 'kbkhbvthdsohjznh'
        }
      },
      defaults : {
        from : '"No Reply" <noreply@gmail.com>'
      },
      template :{
        dir : join(__dirname, 'templates'),
        adapter : new HandlebarsAdapter()
      }
    })
  ],
  providers: [MailService],
  exports : [MailService]
})
export class MailModule {}
