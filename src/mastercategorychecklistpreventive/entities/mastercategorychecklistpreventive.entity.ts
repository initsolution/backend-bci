import { IsOptional } from "class-validator";
import { BasicEntity } from "src/basic-entity";
import { Column, Entity, OneToMany } from "typeorm";
import { CrudValidationGroups } from '@nestjsx/crud';
import { Masterpointchecklistpreventive } from "src/masterpointchecklistpreventive/entities/masterpointchecklistpreventive.entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Mastercategorychecklistpreventive')
export class Mastercategorychecklistpreventive extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    categoryName ?: string

    @OneToMany(()=> Masterpointchecklistpreventive, mpointchecklistpreventive => mpointchecklistpreventive.mcategorychecklistpreventive, {onDelete : 'CASCADE'})
    mpointchecklistpreventive : Masterpointchecklistpreventive
}
