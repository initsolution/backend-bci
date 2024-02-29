import { BasicEntity } from "src/basic-entity";
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Employee } from "src/employee/entities/employee.entity";
import { empty } from "rxjs";
import { Site } from "src/site/entities/site.entity";
import { Categorychecklistpreventive } from "src/categorychecklistpreventive/entities/categorychecklistpreventive.entity";
import { Reportregulertorque } from "src/reportregulertorque/entities/reportregulertorque.entity";
import { Reportregulerverticality } from "src/reportregulerverticality/entities/reportregulerverticality.entity";
import { Asset } from "src/asset/entities/asset.entity";
const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('Task')
export class Task extends BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 50})
    dueDate : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 50})
    submitedDate : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 50})
    verifiedDate : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 50})
    notBefore ?: string
    
    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 10, default : 'todo'})
    status : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 10})
    type : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: false, length : 200})
    towerCategory : string

    @IsOptional({ groups: [UPDATE, CREATE] })
    @Column('varchar', {nullable: true, length : 500})
    note ?: string

    @ManyToOne(()=> Employee, emp => emp.makerEmployee)
    makerEmployee : Employee

    @ManyToOne(()=> Employee, emp => emp.verifierEmployee)
    verifierEmployee : Employee

    @ManyToOne(()=> Site, st => st.site)
    site : Site

    @OneToMany(()=>Categorychecklistpreventive, categorychecklistprev => categorychecklistprev.task, )
    categorychecklistprev: Categorychecklistpreventive[]

    @OneToMany(()=> Reportregulertorque, report => report.task, )
    reportRegulerTorque: Reportregulertorque[]

    @OneToOne(()=> Reportregulerverticality, reportReguler => reportReguler.task,  )
    reportRegulerVerticality: Reportregulerverticality

    @OneToMany(()=> Asset, asset => asset.task, )
    asset: Asset
}
