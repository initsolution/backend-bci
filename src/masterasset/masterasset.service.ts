import { Injectable } from '@nestjs/common';
import { CreateMasterassetDto } from './dto/create-masterasset.dto';
import { UpdateMasterassetDto } from './dto/update-masterasset.dto';
import { Masterasset } from './entities/masterasset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CustomQueryMasterasset } from './dto/custom-query-masterasset.dto';
import { Not } from 'typeorm';

@Injectable()
export class MasterassetService extends TypeOrmCrudService<Masterasset> {
  constructor(@InjectRepository(Masterasset) repo,)
  {
    super(repo)
  }
  

  async getData(dto: CustomQueryMasterasset){
    var pju = !dto.isHavePJU ? {
      category : Not('PJU'),
      taskType : dto.taskType,
        towerHeight : dto.towerHeight,
        fabricator : dto.fabricator,
    } : {
      taskType : dto.taskType,
        towerHeight : dto.towerHeight,
        fabricator : dto.fabricator,
    }
    return await this.repo.find({
      where : pju,
      order : {
        id: "ASC"
      }
    })

  }
}
