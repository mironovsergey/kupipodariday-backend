import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsUrl, IsNumber, Length } from 'class-validator';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
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
    example: 'iPhone 17 Pro',
    description: 'Название подарка',
    minLength: 1,
    maxLength: 250,
  })
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty({
    example: 'https://www.apple.com/iphone-17-pro/',
    description: 'Ссылка на подарок',
  })
  @Column()
  @IsUrl()
  link: string;

  @ApiProperty({
    example: 'https://example.com/iphone.jpg',
    description: 'Ссылка на изображение подарка',
  })
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({
    example: 99999.99,
    description: 'Стоимость подарка',
    type: 'number',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 0,
    description: 'Сколько уже собрано',
    type: 'number',
    default: 0,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber()
  raised: number;

  @ApiProperty({
    example: 'Очень хочу новый iPhone',
    description: 'Описание подарка',
    minLength: 1,
    maxLength: 1024,
  })
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiProperty({
    example: 0,
    description: 'Сколько раз скопировали',
    default: 0,
  })
  @Column('int', { default: 0 })
  @IsNumber()
  copied: number;

  @ApiHideProperty()
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ApiHideProperty()
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ApiHideProperty()
  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
