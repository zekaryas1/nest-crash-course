import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { CoffeType } from './entity/coffe.entity';
import { Flavor } from './entity/flavor.entity';

@Injectable()
export class CoffesService {
  readonly coffes: [] = [];
  constructor(
    @InjectRepository(CoffeType)
    private readonly coffesRepository: Repository<CoffeType>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
  ) {}

  findAll() {
    return this.coffesRepository.find({
      relations: ['flavours'],
    });
  }

  async findOne(id: string) {
    const coffe = await this.coffesRepository.findOne({
      where: { id: +id },
      relations: ['flavours'],
    });
    if (!coffe) {
      // throw new HttpException('Coffe not found', HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffe with id ${id} not found`);
    }
    return coffe;
  }

  async create(newCoffe: CreateCoffeDto) {
    const flavors = await Promise.all(
      newCoffe.flavours.map((name) => this.preloadFlavorByName(name)),
    );

    const coffe = this.coffesRepository.create({
      ...newCoffe,
      flavours: flavors,
    });
    return this.coffesRepository.save(coffe);
  }

  async update(id: string, updateCoffeDto: UpdateCoffeDto) {
    const flavors =
      updateCoffeDto.flavours &&
      (await Promise.all(
        updateCoffeDto.flavours.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffe = await this.coffesRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavours: flavors,
    });
    if (!coffe) {
      throw new NotFoundException(`Coffe with id ${id} not found`);
    }
    return this.coffesRepository.save(coffe);
  }

  async remove(id: string) {
    const coffe = await this.findOne(id);
    return this.coffesRepository.remove(coffe);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorsRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorsRepository.create({ name });
  }
}
