import {
  Controller,
  Req,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthRequest } from '../auth/types/auth.request';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { Wish } from '../wishes/entities/wish.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findOwn(@Req() req: AuthRequest): Promise<UserProfileResponseDto> {
    return this.usersService.findOne({ id: req.user.id });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Обновить информацию о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Профиль обновлен',
    type: UserProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  update(
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateOne({ id: req.user.id }, updateUserDto);
  }

  @Get('me/wishes')
  @ApiOperation({ summary: 'Получить желания текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список желаний', type: [Wish] })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getOwnWishes(@Req() req: AuthRequest): Promise<Wish[]> {
    const user = await this.usersService.findOne({ id: req.user.id });
    return user.wishes;
  }

  @Get(':username')
  @ApiOperation({ summary: 'Получить публичный профиль пользователя' })
  @ApiParam({ name: 'username', description: 'Имя пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Публичный профиль пользователя',
    type: UserPublicProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne({ username });
  }

  @Get(':username/wishes')
  @ApiOperation({ summary: 'Получить желания пользователя' })
  @ApiParam({ name: 'username', description: 'Имя пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список желаний пользователя',
    type: [UserWishesDto],
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne({ username });
    return user.wishes;
  }

  @Post('find')
  @ApiOperation({ summary: 'Найти пользователей по запросу' })
  @ApiResponse({
    status: 200,
    description: 'Список найденных пользователей',
    type: [UserProfileResponseDto],
  })
  async findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponseDto[]> {
    return this.usersService.findMany(findUsersDto.query);
  }
}
