import { PrismaClient, SubscribersOnAuthors } from '@prisma/client';
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
  posts?: Array<Post>;
  profile?: Profile;
  userSubscribedTo?: SubscribersOnAuthors[];
  subscribedToUser?: SubscribersOnAuthors[];
};

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
   post: DataLoader<string, Post[], string>;
   memberType: DataLoader<string, Post, string>;
   userSubscribedTo: DataLoader<string, User, string>;
   subscribedToUser: DataLoader<string, User, string>;
 };