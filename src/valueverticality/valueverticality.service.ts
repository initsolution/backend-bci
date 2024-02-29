import { Injectable } from '@nestjs/common';
import { CreateValueverticalityDto } from './dto/create-valueverticality.dto';
import { UpdateValueverticalityDto } from './dto/update-valueverticality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Valueverticality } from './entities/valueverticality.entity';


@Injectable()
export class ValueverticalityService extends TypeOrmCrudService<Valueverticality>{
  constructor(@InjectRepository(Valueverticality) repo,)
  {
    super(repo)
  }

  async customInsertData(createPointChecklistCategory: CreateValueverticalityDto){
    const dtoInsert = this.repo.create(createPointChecklistCategory)
    return await this.repo.save(dtoInsert)
  }

  async deleteData(reportRegid : number){
    return this.repo.delete({
     reportRegulerVerticality : {
      id : reportRegid
     }
    })
  }
  
}
