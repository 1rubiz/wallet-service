import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { TransactionType } from './transaction-type.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  type: TransactionType;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  delta: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @Column({ nullable: true })
  counterpartyWalletId?: string;

  @Column({ unique: true, nullable: true })
  idempotencyKey?: string;

  @CreateDateColumn()
  createdAt: Date;
}
