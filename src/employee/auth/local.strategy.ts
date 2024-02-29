import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService,
    private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            // ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
          });
  }

  async validate(payload: any) : Promise<any> {
    console.log('validate')
    console.log(payload)
    // const emp = await this.authService.validateEmployee(payload.email, payload.password)
    // if(emp == null){
    //   throw new UnauthorizedException();
    // }
    // return emp
    const res = {
      nik: payload.nik,
      name: payload.name,
      email: payload.email,
    }
    return res
  }

}