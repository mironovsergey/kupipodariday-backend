import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, IsEmail, IsUrl, Length, IsOptional } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User {
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
    example: 'ivan',
    description: 'Имя пользователя',
    minLength: 2,
    maxLength: 30,
  })
  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string;

  @ApiPropertyOptional({
    example: 'Люблю получать подарки',
    description: 'Информация о пользователе',
    maxLength: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  about: string;

  @ApiPropertyOptional({
    example: 'https://i.pravatar.cc/300',
    description: 'Ссылка на аватар',
    default: 'https://i.pravatar.cc/300',
  })
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'E-mail',
  })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password1234',
    description: 'Пароль',
    writeOnly: true,
  })
  @Column({ select: false })
  @IsString()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiHideProperty()
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @ApiHideProperty()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @ApiHideProperty()
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
