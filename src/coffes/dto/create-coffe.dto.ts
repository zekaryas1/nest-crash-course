import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeDto {
  @ApiProperty({
    example: 'Coffe 1',
    description: 'The name of the coffee',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Espresso',
    description: 'The brand of the coffee',
  })
  @IsString()
  readonly brand: string;

  @ApiProperty({
    example: ['Americano', 'Cappuccino', 'Espresso'],
    description: 'The flavour of the coffee',
  })
  @IsString({ each: true })
  readonly flavours: string[];
}
