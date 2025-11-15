import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RegisterDto, LoginDto } from "../dtos/AuthDto";
import { validateDto } from "../middlewares/validateDto";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto: RegisterDto = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };

      if (!dto.email || !dto.username || !dto.password) {
        res
          .status(400)
          .json({ message: "Email, username and password are required" });
        return;
      }

      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginDto = {
        username: req.body.username,
        password: req.body.password,
      };

      if (!dto.username || !dto.password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }

      const result = await authService.login(dto);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
