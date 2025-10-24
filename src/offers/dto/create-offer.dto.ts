import { IsNumber } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends OmitType(Offer, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiProperty({
    example: 1,
    description: 'ID желания, на которое скидываемся',
  })
  @IsNumber()
  itemId: number;
}
