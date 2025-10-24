import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@ApiTags('wishlists')
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все списки желаний' })
  @ApiResponse({
    status: 200,
    description: 'Список всех списков желаний',
    type: [Wishlist],
  })
  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findMany({});
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать новый список желаний' })
  @ApiResponse({
    status: 201,
    description: 'Список желаний создан',
    type: Wishlist,
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(
    @Req() req: AuthRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const userId = req.user.id;
    return this.wishlistsService.create(createWishlistDto, userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получить список желаний по ID' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiResponse({
    status: 200,
    description: 'Информация о списке желаний',
    type: Wishlist,
  })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Обновить список желаний' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiResponse({
    status: 200,
    description: 'Список желаний обновлен',
    type: Wishlist,
  })
  @ApiResponse({
    status: 403,
    description: 'Нельзя редактировать чужие списки желаний',
  })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateOne(
      { id },
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Удалить список желаний' })
  @ApiParam({ name: 'id', description: 'ID списка желаний' })
  @ApiResponse({
    status: 200,
    description: 'Список желаний удален',
    type: Wishlist,
  })
  @ApiResponse({
    status: 403,
    description: 'Нельзя удалять чужие списки желаний',
  })
  @ApiResponse({ status: 404, description: 'Список желаний не найден' })
  async removeOne(
    @Req() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.removeOne({ id }, req.user.id);
  }
}
