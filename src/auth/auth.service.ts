import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SigninUserDto, SigninUserResponseDto } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  signin(user: User): SigninUserResponseDto {
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(createUserDto: CreateUserDto): Promise<SigninUserResponseDto> {
    try {
      const user = await this.usersService.create(createUserDto);
      return this.signin(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Ошибка регистрации пользователя');
    }
  }

  async validatePassword(signinUserDto: SigninUserDto): Promise<User> {
    const user = await this.usersService.findOneWithPassword(
      signinUserDto.username,
    );

    const isPasswordValid = await bcrypt.compare(
      signinUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return user;
  }
}
