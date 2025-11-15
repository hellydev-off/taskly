import { IsString, IsOptional, IsHexColor, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateSectionDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsHexColor()
  @Transform(({ value }) => value || "#6B7280")
  color?: string;
}
