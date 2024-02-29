import { BasicEntity } from "src/basic-entity";
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from "class-validator";
import { Entity, Column, ManyToOne } from "typeorm";
import { Mastercategorychecklistpreventive } from "src/mastercategorychecklistpreventive/entities/mastercategorychecklistpreventive.entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Masterpointchecklistpreventive')
export class Masterpointchecklistpreventive extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    uraian ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    kriteria ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable: false, default : true})
    isChecklist ?: boolean

    @ManyToOne(()=> Mastercategorychecklistpreventive, mcategorychecklistpreventive => mcategorychecklistpreventive.mpointchecklistpreventive)
    mcategorychecklistpreventive : Mastercategorychecklistpreventive
}
