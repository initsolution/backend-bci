import { Injectable } from '@nestjs/common';
import { CreatePointchecklistpreventiveDto } from './dto/create-pointchecklistpreventive.dto';
import { UpdatePointchecklistpreventiveDto } from './dto/update-pointchecklistpreventive.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Pointchecklistpreventive } from './entities/pointchecklistpreventive.entity';
import { Categorychecklistpreventive } from 'src/categorychecklistpreventive/entities/categorychecklistpreventive.entity';

@Injectable()
export class PointchecklistpreventiveService extends TypeOrmCrudService<Pointchecklistpreventive>{
  constructor(@InjectRepository(Pointchecklistpreventive) repo,)
  {
    super(repo)
  }

  async customInsertData(createPointChecklistCategory: CreatePointchecklistpreventiveDto){
    const dtoInsert = this.repo.create(createPointChecklistCategory)
    return await this.repo.save(dtoInsert)
  }

  async deleteData(categoryChecklistPreventiveId : number){
    return await this.repo.delete({
      categoryChecklistPreventive : {
        id : categoryChecklistPreventiveId
      }
    })
  }
}