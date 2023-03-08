import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationDTO } from 'src/common/dto/Pagination.dto';
import { CoffesService } from './coffes.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@Controller('coffes')
export class CoffesController {
  constructor(private readonly coffesService: CoffesService) {}

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationDTO) {
    return this.coffesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCoffeDto) {
    return this.coffesService.create(body);;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCoffeDto) {
    return this.coffesService.update(id, body);
  }

  @Delete(':id')
  remote(@Param('id') id: string) {
    return this.coffesService.remove(id);
  }
}
