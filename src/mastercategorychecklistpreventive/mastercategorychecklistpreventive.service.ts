import { Injectable } from '@nestjs/common';
import { CreateMastercategorychecklistpreventiveDto } from './dto/create-mastercategorychecklistpreventive.dto';
import { UpdateMastercategorychecklistpreventiveDto } from './dto/update-mastercategorychecklistpreventive.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Mastercategorychecklistpreventive } from './entities/mastercategorychecklistpreventive.entity';

@Injectable()
export class MastercategorychecklistpreventiveService extends TypeOrmCrudService<Mastercategorychecklistpreventive>{
  constructor(@InjectRepository(Mastercategorychecklistpreventive) repo,)
  {
    super(repo)
  }

  async customGetAll(){
    return await this.repo.find(
      {
        relations : ['mpointchecklistpreventive'],
        order :{
          id : "ASC",
          mpointchecklistpreventive : {
            id : "ASC"
          }
        }
      }
    )
  }
}
