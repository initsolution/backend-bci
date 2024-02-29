import { Injectable } from '@nestjs/common';
import { CreateReportregulerverticalityDto } from './dto/create-reportregulerverticality.dto';
import { UpdateReportregulerverticalityDto } from './dto/update-reportregulerverticality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Reportregulerverticality } from './entities/reportregulerverticality.entity';
import { ValueverticalityService } from 'src/valueverticality/valueverticality.service';

@Injectable()
export class ReportregulerverticalityService extends TypeOrmCrudService<Reportregulerverticality>{
  constructor(@InjectRepository(Reportregulerverticality) repo,
  private readonly valueVerticalService : ValueverticalityService
  )
  {
    super(repo)
  }

  async customInsertData(createCategory: CreateReportregulerverticalityDto){
    const dtoInsert = this.repo.create(createCategory)
    return await this.repo.save(dtoInsert)
  }

  async deleteData(taskId: number, reportReguler: Reportregulerverticality){
    this.valueVerticalService.deleteData(reportReguler.id).then((value) => {
      return this.repo.delete({
        task : {
          id : taskId
        }
      })
    })
  }
}