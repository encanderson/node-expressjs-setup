import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { User } from "@src/types";

import { UserExist, NotFound } from "@src/api/errors";

const prisma = new PrismaClient();

export class UserRepository {
  createdAt: Date;
  updatedAt: Date;
  password: string;
  user: User;
  date: Date;
  constructor(user: User) {
    this.date = new Date();
    this.password = user.password;
    this.createdAt = this.date;
    this.updatedAt = this.date;
    this.user = user;
  }

  async createUser(code: number): Promise<void> {
    this.user.password = await UserRepository.hashPassword(this.password);
    await prisma.user.create({
      data: {
        active: false,
        name: this.user.name,
        email: this.user.email,
        code: code,
        password: this.user.password,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
    });
  }

  static async getUser(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  static async searchByEmail(newUser: User): Promise<UserRepository> {
    const user = await prisma.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (user) {
      throw new UserExist(newUser.name);
    }
    return new UserRepository(newUser);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  }

  static async recoveryPassword(
    email: string,
    code: number
  ): Promise<{ email: string; name: string }> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        name: true,
      },
    });
    if (user) {
      await prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          code: code,
        },
      });
      return user;
    } else {
      throw new NotFound("Usuário");
    }
  }

  static async checkUser(email: string): Promise<{ code: number }> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        code: true,
      },
    });
    return user;
  }

  static async update(email: string, data: User): Promise<void> {
    if (data.password) {
      data.password = await UserRepository.hashPassword(data.password);
    }
    try {
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      throw new NotFound("Usuário");
    }
  }
}
