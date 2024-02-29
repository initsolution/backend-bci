import { IsOptional } from "class-validator"
import { BasicEntity } from "src/basic-entity";
import { Task } from "src/task/entities/task.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Reportregulertorque')
export class Reportregulertorque extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length :100})
    towerSegment ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int')
    elevasi ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length :10})
    boltSize ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int')
    minimumTorque ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int')
    qtyBolt ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length :100})
    remark ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true})
    orderIndex ?: number

    @ManyToOne(()=> Task, task => task.categorychecklistprev, {cascade : ['remove'], onDelete : 'CASCADE'})
    task:Task
}
