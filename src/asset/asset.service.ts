import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AssetService extends TypeOrmCrudService<Asset>{
  constructor(@InjectRepository(Asset) repo,)
  {
    super(repo)
  }

  async getData(taskId : number){
    return await this.repo.find({
      where : {
        task : {
          id : taskId
        }
      }
    })

  }

  async getDataById(id: number){
    return await this.repo.findOne({
      where : {
        id : id
      },
      relations : ['task']
    })
  }

  async updateData(asset: Asset){
    return await this.repo.update(asset.id, asset)
  }
}
