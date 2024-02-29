import { Injectable } from '@nestjs/common';
import { CreateMasterreportregulertorqueDto } from './dto/create-masterreportregulertorque.dto';
import { UpdateMasterreportregulertorqueDto } from './dto/update-masterreportregulertorque.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Masterreportregulertorque } from './entities/masterreportregulertorque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomQueryMasterasset } from 'src/masterasset/dto/custom-query-masterasset.dto';


@Injectable()
export class MasterreportregulertorqueService extends TypeOrmCrudService<Masterreportregulertorque>{
  constructor(@InjectRepository(Masterreportregulertorque) repo,)
  {
    super(repo)
  }

  async getData(dto: CustomQueryMasterasset){
    return await this.repo.find({
      where : {
        towerHeight : dto.towerHeight,
        fabricator : dto.fabricator
      }
    })

  }
}
