import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployeeModule } from '../employee.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt.auth.guard';

@Module({
  imports: [
      forwardRef(()=> EmployeeModule),
      PassportModule,
      JwtModule.registerAsync({
          imports : [ConfigModule],
          inject : [ConfigService],
          useFactory : async (configService : ConfigService) => ({
              secret : configService.get('JWT_SECRET'),
              signOptions : {expiresIn : configService.get<string>('JWT_EXPIRES')}
          })
      })
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, ConfigService],
  exports : [AuthService]
})
export class AuthModule {}
