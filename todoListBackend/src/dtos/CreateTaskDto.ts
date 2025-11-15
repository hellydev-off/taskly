import { IsString, IsEnum, IsOptional, IsArray, IsDate } from "class-validator";
import { Type } from "class-transformer"; // ✅ ДОБАВЬ ИМПОРТ

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["low", "medium", "high"])
  priority?: "low" | "medium" | "high";

  @IsOptional()
  @IsEnum(["в_процессе", "завершено"])
  status?: "в_процессе" | "завершено";

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date | null;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  sectionId?: string;
}
