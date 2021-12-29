import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { User } from "@src/@types";

import { UserExist, NotFound } from "@src/api/errors";

import { hashFunction } from "../../utils";

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
        app: this.user.app,
        profession: this.user.profession,
        userId: hashFunction(this.user.cpf),
        email: this.user.email,
        code: code,
        password: this.user.password,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        profile: {
          create: {
            name: this.user.name,
          },
        },
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
        userId: true,
        email: true,
        password: true,
        app: true,
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
      select: {
        app: true,
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
    userId: string,
    code: number
  ): Promise<{ email: string; app: string }> {
    const user = await prisma.user.findUnique({
      where: {
        email: userId,
      },
      select: {
        email: true,
        app: true,
        profile: {
          select: {
            name: true,
          },
        },
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

  static async checkUser(
    userId: string
  ): Promise<{ code: number; app: string }> {
    const user = await prisma.user.findUnique({
      where: {
        email: userId,
      },
      select: {
        code: true,
        app: true,
      },
    });
    return user;
  }

  static async update(userId: string, data: User): Promise<void> {
    if (data.password) {
      data.password = await UserRepository.hashPassword(data.password);
    }
    try {
      await prisma.user.update({
        where: {
          email: userId,
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
