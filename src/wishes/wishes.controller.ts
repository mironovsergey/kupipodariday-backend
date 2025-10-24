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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать новое желание' })
  @ApiResponse({ status: 201, description: 'Желание создано', type: Wish })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(
    @Req() req: AuthRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.create(createWishDto, userId);
  }

  @Get('last')
  @ApiOperation({ summary: 'Получить последние 40 желаний' })
  @ApiResponse({
    status: 200,
    description: 'Список последних желаний',
    type: [Wish],
  })
  async findLast(): Promise<Wish[]> {
    return this.wishesService.findLast(40);
  }

  @Get('top')
  @ApiOperation({ summary: 'Получить топ 20 самых копируемых желаний' })
  @ApiResponse({
    status: 200,
    description: 'Топ желаний',
    type: [Wish],
  })
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findTop(20);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получить желание по ID' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiResponse({ status: 200, description: 'Информация о желании', type: Wish })
  @ApiResponse({ status: 404, description: 'Желание не найдено' })
  async findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Обновить желание' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiResponse({ status: 200, description: 'Желание обновлено', type: Wish })
  @ApiResponse({
    status: 403,
    description: 'Нельзя редактировать чужие желания',
  })
  @ApiResponse({ status: 404, description: 'Желание не найдено' })
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.updateOne({ id }, updateWishDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Удалить желание' })
  @ApiParam({ name: 'id', description: 'ID желания' })
  @ApiResponse({ status: 200, description: 'Желание удалено', type: Wish })
  @ApiResponse({ status: 403, description: 'Нельзя удалять чужие желания' })
  @ApiResponse({ status: 404, description: 'Желание не найдено' })
  async removeOne(
    @Req() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<Wish> {
    return this.wishesService.removeOne({ id }, req.user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(201)
  @ApiOperation({ summary: 'Скопировать желание себе' })
  @ApiParam({ name: 'id', description: 'ID желания для копирования' })
  @ApiResponse({ status: 201, description: 'Желание скопировано', type: Wish })
  @ApiResponse({ status: 404, description: 'Желание не найдено' })
  async copyWish(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.copyWish(id, userId);
  }
}
