import { PrismaClient } from '@prisma/client';
import DataLoader from "dataloader"
//import {Profiles, PostType} from '../types/types.js'
import {
  Post, Profile, User,MemberType
} from '../types/typesJS.js';
const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader( async (keys:  readonly string[]) => {
    const results = (await prisma.profile.findMany({
      where: {
        id: { in: keys as string[] },
      },
    })) as Profile[];
    
    //const profileMap = new Map<string, >()
    const profiles = keys.map((key) => {
      return results.find((profile) => profile.id === key)  ;
    });;
    
    return profiles;
  })
};

const createPostLoader = (prisma: PrismaClient) => {
   return new DataLoader(async (keys:  readonly string[]) => {
    const results = (await prisma.post.findMany({
      where: {
        authorId: { in: keys as string[] },
      },
    })) as Post[];
    
      const posts = keys.map((key) => {return results.find((post) => post.authorId === key) });
    return posts;
  })
};

const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[])=>{
    const results = (await prisma.memberType.findMany({
      where: {
        id: { in: keys as string[] },
      },
    })) as MemberType[];

    const memberTypes = keys.map((key) => {
      return results.find((memberType) => memberType.id === key) as MemberType;
    });
    return memberTypes;

  })
}

const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const results = (await prisma.user.findMany({
      where: {
        id: { in: keys as string[] },
      },
    })) as User[];

    const memberTypes = keys.map((key) => {
      return results.find((user) => user.id === key) as User;
    });
    return memberTypes;
  });
};


export const createDataLoader = (prisma: PrismaClient) => {
  return {
    profile: createProfileLoader(prisma),
    post: createPostLoader(prisma),
    memberType: createMemberTypeLoader(prisma),
    user: createUserLoader(prisma),
    userSubscribedTo: 4,
    subscribedToUser: 5,
  };
}