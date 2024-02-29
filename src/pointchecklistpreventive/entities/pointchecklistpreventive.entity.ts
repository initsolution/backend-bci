import { IsOptional } from "class-validator"
import { Categorychecklistpreventive } from "src/categorychecklistpreventive/entities/categorychecklistpreventive.entity"
import { Entity, Column, ManyToOne } from "typeorm"
import { CrudValidationGroups } from '@nestjsx/crud';
import { BasicEntity } from "src/basic-entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Pointchecklistpreventive')
export class Pointchecklistpreventive extends BasicEntity{
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 10000})
    uraian ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 1000})
    kriteria ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 20})
    hasil ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 1000})
    keterangan ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true,})
    orderIndex ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable: false, default : true})
    isChecklist ?: boolean
    
    @ManyToOne(()=> Categorychecklistpreventive, category => category.pointChecklistPreventive, {cascade : ['remove'], onDelete : 'CASCADE'})
    categoryChecklistPreventive : Categorychecklistpreventive
}
