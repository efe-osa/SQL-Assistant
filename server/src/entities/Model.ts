import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from './Brand';
import { CarVin } from './CarVin';
import { CarOption } from './CarOption';

@Entity('Models')
export class Model {
    @PrimaryGeneratedColumn()
    model_id!: number;

    @Column({ length: 50 })
    model_name!: string;

    @Column({ nullable: true })
    model_base_price!: number;

    @Column()
    brand_id!: number;

    @ManyToOne(() => Brand, brand => brand.models)
    @JoinColumn({ name: 'brand_id' })
    brand!: Brand;

    @OneToMany(() => CarVin, carVin => carVin.model)
    carVins!: CarVin[];

    @OneToMany(() => CarOption, carOption => carOption.model)
    carOptions!: CarOption[];
}