import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { User as UserType } from "@src/types";

import { UserExist } from "@src/api/errors";

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
}
