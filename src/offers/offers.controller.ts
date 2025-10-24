import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@ApiTags('offers')
@Controller('offers')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать предложение' })
  @ApiResponse({
    status: 201,
    description: 'Предложение создано',
    type: Offer,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(
    @Req() req: AuthRequest,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const userId = req.user.id;
    return this.offersService.create(createOfferDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все предложения' })
  @ApiResponse({
    status: 200,
    description: 'Список предложений',
    type: [Offer],
  })
  async findAll(): Promise<Offer[]> {
    return this.offersService.findMany({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить предложение по ID' })
  @ApiParam({ name: 'id', description: 'ID предложения' })
  @ApiResponse({
    status: 200,
    description: 'Информация о предложении',
    type: Offer,
  })
  @ApiResponse({ status: 404, description: 'Предложение не найдено' })
  async findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne({ id });
  }
}
