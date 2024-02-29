import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {
    IsOptional,
} from 'class-validator'
import { CrudValidationGroups } from '@nestjsx/crud';
import { Task } from "src/task/entities/task.entity";
const { CREATE, UPDATE } = CrudValidationGroups;
@Entity('Employee')
export class Employee {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @PrimaryColumn('varchar',{
        nullable : false,
        length : 20
    })
    nik ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    name ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    email ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 20})
    hp ?: String

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 10})
    role ?: string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    password ?:string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable : false, default : true})
    isActive ?: boolean

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('boolean', {nullable : false, default : true})
    isVendor ?: boolean 

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 100})
    urlEsign ?:string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    instansi ?:string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 200})
    tokenReset ?:string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @IsOptional({ groups: [UPDATE, CREATE] })
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @IsOptional({ groups: [UPDATE, CREATE] })
    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;

    @OneToMany(()=> Task, task => task.makerEmployee)
    makerEmployee : Task

    @OneToMany(()=> Task, task => task.verifierEmployee)
    verifierEmployee : Task
}
