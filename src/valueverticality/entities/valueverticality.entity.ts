import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';
import { BasicEntity } from 'src/basic-entity';
import { Reportregulerverticality } from 'src/reportregulerverticality/entities/reportregulerverticality.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Valueverticality')
export class Valueverticality extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    theodoliteIndex ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    section ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 1})
    miringKe ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    value ?: number

    @ManyToOne(()=> Reportregulerverticality, report => report.valueVerticality, {cascade : ['remove'], onDelete : 'CASCADE'})
    reportRegulerVerticality : Reportregulerverticality
}


