import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
    return this.coffesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCoffeDto) {
    return this.coffesService.update(id, body);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The record has been successfully deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remote(@Param('id') id: string) {
    return this.coffesService.remove(id);
  }
}
