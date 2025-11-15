import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { RegisterDto, LoginDto, AuthResponseDto } from "../dtos/AuthDto";

const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const existingEmail = await userRepository.findByEmail(dto.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await userRepository.create(
      dto.email,
      dto.username,
      hashedPassword
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await userRepository.findByUsername(dto.username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    };
  }
}
