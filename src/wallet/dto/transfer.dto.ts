/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID, IsNumber, Min } from 'class-validator';

export class TransferDto {
  @IsUUID()
  fromWalletId: string;

  @IsUUID()
  toWalletId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
