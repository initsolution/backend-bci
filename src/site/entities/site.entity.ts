import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from 'class-validator';
import { Task } from 'src/task/entities/task.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('Site')
export class Site {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @PrimaryColumn('varchar',{
        nullable : false,
        length : 20
    })
    id ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    name ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    towerType ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('int', {default : 0})
    towerHeight ?: number

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 100})
    fabricator ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    tenants ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    province ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    region ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 1000})
    address ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    longitude ?: string
    
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    latitude ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable : false, default : false})
    isHavePJU ?: boolean

    @IsOptional({ groups: [UPDATE, CREATE] })
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @IsOptional({ groups: [UPDATE, CREATE] })
    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;

    @OneToMany(()=> Task, task => task.site)
    site : Task
}
