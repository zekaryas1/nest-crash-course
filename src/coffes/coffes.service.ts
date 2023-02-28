import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/commons/dto/Pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { CoffeType } from './entity/coffe.entity';
import { Flavor } from './entity/flavor.entity';
import { Event } from 'src/events/entities/entities.event';

@Injectable()
export class CoffesService {
  readonly coffes: [] = [];
  constructor(
    @InjectRepository(CoffeType)
    private readonly coffesRepository: Repository<CoffeType>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(PaginationDTO: PaginationDTO) {
    const { offset, limit } = PaginationDTO;
    return this.coffesRepository.find({
      relations: ['flavours'],
      skip: offset,
      take: limit,
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

  async recommendCoffe(coffe: CoffeType) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffe.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffe';
      recommendEvent.type = 'coffe';
      recommendEvent.payload = {
        coffeId: coffe.id,
      };

      await queryRunner.manager.save(coffe);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
