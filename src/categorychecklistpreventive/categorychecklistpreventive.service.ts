import { Injectable } from '@nestjs/common';
import { CreateCategorychecklistpreventiveDto } from './dto/create-categorychecklistpreventive.dto';
import { UpdateCategorychecklistpreventiveDto } from './dto/update-categorychecklistpreventive.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Categorychecklistpreventive } from './entities/categorychecklistpreventive.entity';
import { PointchecklistpreventiveService } from 'src/pointchecklistpreventive/pointchecklistpreventive.service';

@Injectable()
export class CategorychecklistpreventiveService extends TypeOrmCrudService<Categorychecklistpreventive>{
  constructor(@InjectRepository(Categorychecklistpreventive) repo,
  private readonly pointChecklistPreventiveService : PointchecklistpreventiveService
  )
  {
    super(repo)
  }

  async customInsertData(createCategory: CreateCategorychecklistpreventiveDto){
    const dtoInsert = await this.repo.create(createCategory)
    return await this.repo.save(dtoInsert)
  }

  async deleteData(categoryChecklistPreventive: Categorychecklistpreventive){
    this.pointChecklistPreventiveService.deleteData(categoryChecklistPreventive.id).then((value) => {
      return this.repo.delete({
        id : categoryChecklistPreventive.id
      })
    })
  }
}