import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          entities: [Wallet, Transaction],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Wallet, Transaction]),
      ],
      providers: [WalletService],
    }).compile();

    service = module.get(WalletService);
  });

  it('creates a wallet with zero balance', async () => {
    const wallet = await service.createWallet('USD');
    expect(wallet.balance).toBe(0);
  });

  it('funds a wallet', async () => {
    const wallet = await service.createWallet('USD');
    const funded = await service.fundWallet(wallet.id, 100);

    expect(funded.balance).toBe(100);
  });

  it('prevents overdraft', async () => {
    const a = await service.createWallet('USD');
    const b = await service.createWallet('USD');

    await expect(service.transfer(a.id, b.id, 50)).rejects.toThrow(
      'Insufficient balance',
    );
  });
});
