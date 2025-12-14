import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (tx) => tx.wallet)
  transactions: Transaction[];
}
