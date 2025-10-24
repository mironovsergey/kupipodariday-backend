import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from './guards/local.guard';
import { AuthRequest } from './types/auth.request';
import { SigninUserDto, SigninUserResponseDto } from './dto/signin-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: SigninUserDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: SigninUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  signin(@Req() req: AuthRequest) {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким username или email уже существует',
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
