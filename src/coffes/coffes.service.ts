import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { CoffeType } from './entity/coffe.entity';

@Injectable()
export class CoffesService {
  private coffes: UpdateCoffeDto[] = [
    {
      id: 1,
      name: 'Cafe A',
      brand: 'Cafe A',
      flavours: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffes;
  }

  findOne(id: string) {
    const coffe = this.coffes.find((c) => c.id === +id);
    if (!coffe) {
      // throw new HttpException('Coffe not found', HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffe with id ${id} not found`);
    }
    return coffe;
  }

  create(newCoffe) {
    newCoffe.id = Math.floor(Math.random() * 100);
    this.coffes.push(newCoffe);
    return newCoffe;;
  }

  update(id: string, coffeDto) {
    const index = this.coffes.findIndex((c) => c.id === +id);
    this.coffes[index] = coffeDto;
    return this.coffes[index];
  }

  remove(id: string) {
    const index = this.coffes.findIndex((c) => c.id === +id);
    if (index > 0) {
      this.coffes.splice(index, 1);
    }
  }
}
