import { BasicEntity } from "src/basic-entity";
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from "class-validator";
import { Entity, Column, ManyToOne } from "typeorm";
import { Task } from "src/task/entities/task.entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Asset')
export class Asset extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    category ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    description ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    url ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable : false, default : false})
    isPassed ?: boolean

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    note ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    section ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int')
    orderIndex ?: number

    @ManyToOne(()=> Task, task => task.asset, {cascade : ['remove'], onDelete : 'CASCADE'})
    task: Task
}
