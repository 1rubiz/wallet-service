/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @IsNumber()
  @Min(0.01)
  amount: number;
}
