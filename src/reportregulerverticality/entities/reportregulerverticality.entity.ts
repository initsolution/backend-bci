import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';
import { BasicEntity } from 'src/basic-entity';
import { Task } from 'src/task/entities/task.entity';
import { Valueverticality } from 'src/valueverticality/entities/valueverticality.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('Reportregulerverticality')
export class Reportregulerverticality extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    horizontalityAb ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    horizontalityBc ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    horizontalityCd ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    horizontalityDa ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 10})
    theodolite1 ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 10})
    theodolite2 ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    alatUkur ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    toleransiKetegakan ?: number

    @OneToOne(()=> Task, task => task.reportRegulerVerticality, {cascade : ['remove'], onDelete : 'CASCADE'})
    @JoinColumn()
    task ?: Task

    @OneToMany(()=>Valueverticality, valueVer=> valueVer.reportRegulerVerticality, )
    valueVerticality?: Valueverticality[]
}
