import { Controller, Post, Body, Param, Get } from '@nestjs/common';
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
  fund(@Param('id') id: string, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(id, dto.amount);
  }

  @Post('transfer')
  transfer(@Body() dto: TransferDto) {
    return this.walletService.transfer(
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
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
