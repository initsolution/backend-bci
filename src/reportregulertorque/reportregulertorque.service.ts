import { Injectable } from '@nestjs/common';
import { CreateReportregulertorqueDto } from './dto/create-reportregulertorque.dto';
import { UpdateReportregulertorqueDto } from './dto/update-reportregulertorque.dto';
import { Reportregulertorque } from './entities/reportregulertorque.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class ReportregulertorqueService extends TypeOrmCrudService<Reportregulertorque>{
  constructor(@InjectRepository(Reportregulertorque) repo,)
  {
    super(repo)
  }

  async deleteData(taskId : number){
    return this.repo.delete({
      task : {
        id : taskId
      }
    })
  }
  
}
