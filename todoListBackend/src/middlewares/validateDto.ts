import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(DtoClass, req.body);

    const errors = await validate(dto);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error: ValidationError) => ({
        field: error.property,
        constraints: error.constraints,
      }));

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    req.body = dto;
    next();
  };
}
