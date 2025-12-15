import { Controller, Post, Body, Param, Get, Headers } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferDto } from './dto/transfer.dto';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto.currency);
  }

  @Post(':id/fund')
  @Post(':id/fund')
  fundWallet(
    @Param('id') id: string,
    @Body() dto: FundWalletDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.walletService.fundWallet(id, dto.amount, idempotencyKey);
  }

  @Post('transfer')
  transfer(
    @Body() dto: TransferDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.walletService.transfer(
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
      idempotencyKey,
    );
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.walletService.getWallet(id);
  }

  @Get()
  all() {
    return this.walletService.getAll();
  }
}
