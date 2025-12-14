import { IsIn } from 'class-validator';

export class CreateWalletDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsIn(['USD'])
  currency: string;
}
