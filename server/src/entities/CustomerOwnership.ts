import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './Customer';
import { CarVin } from './CarVin';
import { Dealer } from './Dealer';

@Entity('Customer_Ownership')
export class CustomerOwnership {
    @PrimaryColumn()
    customer_id!: number;

    @PrimaryColumn()
    vin!: number;

    @Column()
    purchase_date!: Date;

    @Column()
    purchase_price!: number;

    @Column({ nullable: true })
    warranty_expire_date!: Date;

    @Column()
    dealer_id!: number;

    @ManyToOne(() => Customer, customer => customer.customerOwnerships)
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @ManyToOne(() => CarVin, carVin => carVin.customerOwnerships)
    @JoinColumn({ name: 'vin' })
    carVin!: CarVin;

    @ManyToOne(() => Dealer, dealer => dealer.customerOwnerships)
    @JoinColumn({ name: 'dealer_id' })
    dealer!: Dealer;
}