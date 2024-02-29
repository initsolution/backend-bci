import { BasicEntity } from "src/basic-entity";
import { Column, Entity } from "typeorm";
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from "class-validator";
const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('Tenant')
export class Tenant extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 10})
    kodeTenant ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    name ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable : false, default : true})
    isActive: boolean
}
