import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffesController } from './coffes.controller';
import { CoffesService } from './coffes.service';
import { CoffeType } from './entity/coffe.entity';
import { Flavor } from './entity/flavor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CoffeType, Flavor])],
    controllers: [CoffesController],
    providers: [CoffesService],
})
export class CoffesModule {}
