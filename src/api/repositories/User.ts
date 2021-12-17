import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { User as UserType } from "@src/types";

import { UserExist, NotFound } from "@src/api/errors";

const prisma = new PrismaClient();

export class UserModel {
  createdAt: Date;
  updatedAt: Date;
  password: string;
  user: UserType;
  date: Date;
  constructor(user: UserType) {
    this.date = new Date();
    this.password = user.password;
    this.createdAt = this.date;
    this.updatedAt = this.date;
    this.user = user;
  }

  async createUser(): Promise<void> {
    this.user.password = await UserModel.hashPassword(this.password);
    await prisma.userModel.create({
      data: {
        ...this.user,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
    });
  }

  static async getUser(email: string): Promise<UserType> {
    const user = await prisma.userModel.findUnique({
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

  static async searchByEmail(newUser: UserType): Promise<UserModel> {
    const user = await prisma.userModel.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (user) {
      throw new UserExist(newUser.name);
    }
    return new UserModel(newUser);
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
    const user = await prisma.userModel.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        name: true,
      },
    });
    if (user) {
      await prisma.userModel.update({
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
    const user = await prisma.userModel.findUnique({
      where: {
        email: email,
      },
      select: {
        code: true,
      },
    });
    return user;
  }

  static async update(
    email: string,
    data: { password: string }
  ): Promise<void> {
    if (data.password) {
      data.password = await UserModel.hashPassword(data.password);
    }
    try {
      await prisma.userModel.update({
        where: {
          email: email,
        },
        data: data,
      });
    } catch (err) {
      throw new NotFound("Usuário");
    }
  }
}
