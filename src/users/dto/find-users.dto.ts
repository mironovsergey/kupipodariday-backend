import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindUsersDto {
  @ApiProperty({
    example: 'ivan',
    description: 'Поисковый запрос (ищет по username и email)',
  })
  @IsString()
  query: string;
}
