import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2025-01-15T10:00:00.000Z',
    description: 'Дата создания',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-15T10:00:00.000Z',
    description: 'Дата обновления',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: 100.5,
    description: 'Сумма взноса',
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Скрыть ли предложение',
    default: false,
  })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ApiHideProperty()
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
