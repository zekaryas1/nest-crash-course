import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { CreateCoffeDto } from "./create-coffe.dto";

export class UpdateCoffeDto extends PartialType(CreateCoffeDto) {

    @IsString()
    readonly id: string;
}
  