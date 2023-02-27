import { IsString } from "class-validator";
import { Flavor } from "../entity/flavor.entity";

export class CreateCoffeDto {

  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavours: string[];
}
