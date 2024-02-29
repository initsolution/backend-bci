import { Injectable } from '@nestjs/common';
import { CreateMasterpointchecklistpreventiveDto } from './dto/create-masterpointchecklistpreventive.dto';
import { UpdateMasterpointchecklistpreventiveDto } from './dto/update-masterpointchecklistpreventive.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Masterpointchecklistpreventive } from './entities/masterpointchecklistpreventive.entity';

@Injectable()
export class MasterpointchecklistpreventiveService extends TypeOrmCrudService<Masterpointchecklistpreventive>{
  constructor(@InjectRepository(Masterpointchecklistpreventive) repo,)
  {
    super(repo)
  }
}