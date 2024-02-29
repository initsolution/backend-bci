import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {
    IsOptional,
} from 'class-validator'
import { CrudValidationGroups } from '@nestjsx/crud';
const { CREATE, UPDATE } = CrudValidationGroups;
export class BasicEntity {
    @IsOptional({ groups: [UPDATE, CREATE] })
    @PrimaryGeneratedColumn()
    id?: number;

    @IsOptional({ groups: [UPDATE, CREATE] })
    @CreateDateColumn({ nullable: true })
    created_at?: Date;

    @IsOptional({ groups: [UPDATE, CREATE] })
    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;
}