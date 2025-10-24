import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsOptional, IsUrl, Length } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
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
    example: 'Мой список желаний на день рождения',
    description: 'Название списка',
    minLength: 1,
    maxLength: 250,
  })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiPropertyOptional({
    example: 'Что хочу получить на день рождения',
    description: 'Описание списка',
    maxLength: 1500,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(0, 1500)
  description: string;

  @ApiPropertyOptional({
    example: 'https://example.com/wishlist-cover.jpg',
    description: 'Ссылка на изображение обложки',
  })
  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  image: string;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ApiHideProperty()
  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[];
}
