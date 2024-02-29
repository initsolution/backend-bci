import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';
import { BasicEntity } from 'src/basic-entity';
import { Entity, Column } from 'typeorm';
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Masterreportregulertorque')
export class Masterreportregulertorque extends BasicEntity{
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    fabricator ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true,})
    towerHeight ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    towerSegment ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true,})
    elevasi ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 10})
    boltSize ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true,})
    minimumTorque ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {nullable: true,})
    qtyBolt ?: number
}
