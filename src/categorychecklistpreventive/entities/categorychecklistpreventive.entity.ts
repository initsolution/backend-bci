import { BasicEntity } from "src/basic-entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from "class-validator";
import { Task } from "src/task/entities/task.entity";
import { Pointchecklistpreventive } from "src/pointchecklistpreventive/entities/pointchecklistpreventive.entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Categorychecklistpreventive')
export class Categorychecklistpreventive extends BasicEntity{
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    nama ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    keterangan ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable : true})
    orderIndex ?: number

    @ManyToOne(()=>Task, task => task.categorychecklistprev, {cascade : ['remove'], onDelete : 'CASCADE'})
    task:Task

    @OneToMany(()=>Pointchecklistpreventive, point => point.categoryChecklistPreventive, )
    pointChecklistPreventive : Pointchecklistpreventive[]
}
