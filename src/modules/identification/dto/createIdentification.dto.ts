import {IsUUID, IsNumber } from 'class-validator';

export class CreateIdentificationDto {
  @IsNumber()
  statutIdentificationId: number;

  @IsUUID()
  promoId: string;

  @IsUUID()
  utilisateurId: string;
}
