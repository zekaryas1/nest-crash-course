import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CoffesService } from './coffes.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@ApiTags('coffes')
@Controller('coffes')
export class CoffesController {
  constructor(private readonly coffesService: CoffesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    return this.coffesService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: CreateCoffeDto,
  })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCoffeDto) {
    this.coffesService.create(body);
    return body;
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
