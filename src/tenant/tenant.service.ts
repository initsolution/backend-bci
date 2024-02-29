import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class TenantService extends TypeOrmCrudService<Tenant> {
  constructor(@InjectRepository(Tenant) repo,)
  {
    super(repo)
  }

  async getTenantByKode(kodeTenant : string) {
    return this.repo.findOne({
      where : {
        kodeTenant : kodeTenant
      }
    })
  }
}
