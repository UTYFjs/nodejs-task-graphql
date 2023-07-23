import { PrismaClient } from '@prisma/client';
import DataLoader from "dataloader"
import { Post, Profile, MemberType} from '../types/typesJS.js';

const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader( async (keys:  readonly string[]) => {
        const ids = [...keys];
    const results = (await prisma.profile.findMany({
      where: {
        userId: { in: ids },
      },
    })) as Profile[];
    //sorting results according to keys order
    const profiles = ids.map((key) => {
      return results.find((profile) => profile.userId === key)  ;
    });;
    
    return profiles;
  })
};

const createPostLoader = (prisma: PrismaClient) => {
   return new DataLoader(async (keys:  readonly string[]) => {
    const ids = [...keys];
    const results = (await prisma.post.findMany({
      where: {
        authorId: { in: ids },
      },
    })) as Post[];
        const posts = ids.map((key) => {
        return results.find((post) => post.authorId === key);
      });
      return posts;
  })
};

const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[])=>{
    const ids = [...keys];
    const results = (await prisma.memberType.findMany({
      where: {
        id: { in: ids },
      },
    })) as MemberType[];

    const memberTypes = ids.map((key) => {
      return results.find((memberType) => memberType.id === key) as MemberType;
    });
    return memberTypes;

  })
}

/*const createUserLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = (await prisma.user.findMany(
     {
      where: {
        id: { in: ids},
      },
    })) as User[];

    const users = ids.map((key) => {
      return results.find((user) => user.id === key);
    });
    return users;
  });
};*/


const createUserSubscribedTo = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = await prisma.subscribersOnAuthors.findMany({
      where: {
        subscriberId: { in: ids },
      },
      select: {
        subscriberId: true,
        author: true,
      },
    });
    const users = ids.map((key) => {
      return results.find((memberType) => memberType.subscriberId === key)?.author ;
    });
    return users;
  });
};

const createSubscribedToUser = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = await prisma.subscribersOnAuthors.findMany({
      where: {
        authorId: { in: ids },
      },
      select: {
        authorId: true,
        subscriber: true,
      },
    });
      const users = ids.map((key) => {
      return results.find((memberType) => memberType.authorId === key)?.subscriber;
    });
    return users;
  });
};




export const createDataLoader = (prisma: PrismaClient) => {
  return {
    profile: createProfileLoader(prisma),
    post: createPostLoader(prisma),
    memberType: createMemberTypeLoader(prisma),
    //user: createUserLoader(prisma),
    userSubscribedTo: createUserSubscribedTo(prisma),
    subscribedToUser: createSubscribedToUser(prisma),
  };
}