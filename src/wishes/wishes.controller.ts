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
  ForbiddenException,
} from '@nestjs/common';
import { AuthRequest } from '../auth/types/auth.request';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
@UseGuards(JwtGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Req() req: AuthRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.create(createWishDto, userId);
  }

  @Get('last')
  async findLast(): Promise<Wish[]> {
    return this.wishesService.findLast(40);
  }

  @Get('top')
  async findTop(): Promise<Wish[]> {
    return this.wishesService.findTop(20);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Req() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.wishesService.findOne({ id });

    if (wish.owner.id !== req.user.id) {
      throw new ForbiddenException('Нельзя редактировать чужие хотелки');
    }

    return this.wishesService.updateOne({ id }, updateWishDto);
  }

  @Delete(':id')
  async removeOne(
    @Req() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<Wish> {
    const wish = await this.wishesService.findOne({ id });

    if (wish.owner.id !== req.user.id) {
      throw new ForbiddenException('Нельзя удалять чужие хотелки');
    }

    return this.wishesService.removeOne({ id });
  }

  @Post(':id/copy')
  @HttpCode(201)
  async copyWish(
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ): Promise<Wish> {
    const userId = req.user.id;
    return this.wishesService.copyWish(id, userId);
  }
}
