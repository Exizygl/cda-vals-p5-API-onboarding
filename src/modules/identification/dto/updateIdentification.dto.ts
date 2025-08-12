import { IsNumber } from 'class-validator';

export class UpdateIdentificationDto {
  @IsNumber()
  statutIdentificationId: number;
}