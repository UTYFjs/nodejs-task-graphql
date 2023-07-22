import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

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
export type User = {
  id: string;
  name: string;
  balance: number;
  posts: Array<Post>;
  profile?: Profile; 
}

export type Profile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  memberType: MemberType;
  userId: string;
  user: User;
};


export type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  //author: User;
}
export type MemberType = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
}

export type ContextValue = {
  prisma: PrismaClient;
  loader: loaders;
}
 type loaders = {
   profile: DataLoader<string, Profile, string>;
   post: DataLoader<string, Post, string>;
   memberType: DataLoader<string, Post, string>;
   user: DataLoader<string, User, string>;
   userSubscribedTo: number;
   subscribedToUser: number;
 };