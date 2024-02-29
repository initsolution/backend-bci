import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';
import { BasicEntity } from 'src/basic-entity';
import { Column, Entity } from 'typeorm';
const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('Masterasset')
export class Masterasset extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    taskType ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    section ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    fabricator ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    category ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    description?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int')
    towerHeight ?: number
}
