import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserResponseDto } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalGuard } from './guards/local.guard';
import { AuthRequest } from './types/auth.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: AuthRequest): SigninUserResponseDto {
    return this.authService.signin(req.user);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<SigninUserResponseDto> {
    return this.authService.signup(createUserDto);
  }
}
