import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { TransactionType } from './entities/transaction-type.enum';
import { EntityManager } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,

    @InjectRepository(Transaction)
    private txRepo: Repository<Transaction>,
  ) {}

  async createWallet(currency: string) {
    const wallet = this.walletRepo.create({ currency });
    return this.walletRepo.save(wallet);
  }

  async fundWallet(walletId: string, amount: number, idempotencyKey?: string) {
    return this.walletRepo.manager.transaction(async (manager) => {
      await this.assertIdempotency(manager, idempotencyKey);

      const wallet = await manager.findOne(Wallet, {
        where: { id: walletId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      const tx = manager.create(Transaction, {
        type: TransactionType.FUND,
        amount,
        delta: amount,
        wallet,
        idempotencyKey,
      });

      wallet.balance += amount;

      await manager.save(wallet);
      await manager.save(tx);

      return wallet;
    });
  }

  async transfer(
    fromId: string,
    toId: string,
    amount: number,
    idempotencyKey?: string,
  ) {
    if (fromId === toId) {
      throw new BadRequestException('Cannot transfer to same wallet');
    }

    return this.walletRepo.manager.transaction(async (manager) => {
      const debitKey = idempotencyKey ? `${idempotencyKey}_debit` : undefined;
      const creditKey = idempotencyKey ? `${idempotencyKey}_credit` : undefined;

      await this.assertIdempotency(manager, debitKey);
      await this.assertIdempotency(manager, creditKey);

      const from = await manager.findOne(Wallet, { where: { id: fromId } });
      const to = await manager.findOne(Wallet, { where: { id: toId } });

      if (!from || !to) {
        throw new NotFoundException('Wallet not found');
      }

      if (from.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      from.balance -= amount;
      to.balance += amount;

      const debit = manager.create(Transaction, {
        type: TransactionType.TRANSFER,
        amount,
        delta: -amount,
        wallet: from,
        counterpartyWalletId: toId,
        idempotencyKey: debitKey,
      });

      const credit = manager.create(Transaction, {
        type: TransactionType.TRANSFER,
        amount,
        delta: amount,
        wallet: to,
        counterpartyWalletId: fromId,
        idempotencyKey: creditKey,
      });

      await manager.save([from, to]);
      await manager.save([debit, credit]);

      return { from, to };
    });
  }

  async getWallet(id: string) {
    const wallet = await this.walletRepo.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getAll() {
    const wallet = await this.walletRepo.find();

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  private async assertIdempotency(manager: EntityManager, key?: string) {
    if (!key) return;

    const exists = await manager.findOne(Transaction, {
      where: { idempotencyKey: key },
    });

    if (exists) {
      throw new ConflictException('Duplicate request');
    }
  }
}
