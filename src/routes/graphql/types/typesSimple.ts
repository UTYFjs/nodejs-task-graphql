import { PrismaClient } from '@prisma/client';

export type PostInput = {
  title: string;
  content: string;
  authorId: string;
};

export type UserInput = {
  name: string;
  balance: number;
}

export type ProfileInput = {
  userId: string;
  memberTypeId: 'basic' | 'business';
  isMale: boolean;
  yearOfBirth: number;
}

export type ContextValue = {
  prisma: PrismaClient;
}