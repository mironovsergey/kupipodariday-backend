import { IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Wishlist } from '../entities/wishlist.entity';

export class CreateWishlistDto extends OmitType(Wishlist, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Массив ID желаний для добавления в список',
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  itemsId?: number[];
}
