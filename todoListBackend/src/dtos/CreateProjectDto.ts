import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
  IsHexColor,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateProjectDto {
  @IsString()
  @MinLength(3, { message: "Name must be at least 3 characters" })
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim() || "")
  description?: string;

  @IsOptional()
  @IsIn(["list", "board"])
  @Transform(({ value }) => value || "list")
  viewType?: "list" | "board";

  @IsOptional()
  @IsHexColor()
  @Transform(({ value }) => value || "#3B82F6")
  color?: string;
}
