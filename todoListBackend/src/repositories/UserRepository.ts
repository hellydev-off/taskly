import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(
    email: string,
    username: string,
    hashedPassword: string
  ): Promise<User> {
    const user = this.repository.create({
      email,
      username,
      password: hashedPassword,
    });
    return await this.repository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }
}
