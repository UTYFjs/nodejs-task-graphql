
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post, Profile, MemberType } from '../types/typesJS.js';

export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = (await prisma.profile.findMany({
      where: {
        userId: { in: ids },
      },
    })) as Profile[];
    //sorting results according to keys order
    const profiles = ids.map((key) => {
      return results.find((profile) => profile.userId === key);
    });

    return profiles;
  });
};

export const createPostLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    //get all posts of all authors
    const results = (await prisma.post.findMany({
      where: {
        authorId: { in: ids },
      },
    }));

    //console.log("POST LOADER RESults --------------->", results);
    //sorting posts by authors
    const posts1:Record<string, Post[]> ={};
    results.forEach((post) => {
      let authorPostsCollection = posts1[post.authorId];
      if(!authorPostsCollection){
        authorPostsCollection = []
      }
      authorPostsCollection.push(post)
      posts1[post.authorId] = authorPostsCollection;
    })
    // sorting by order key
    const posts2 = ids.map((key) => {
      return posts1[key]
    })

    const posts = ids.map((key) => {
      return results.find((post) => post.authorId === key);
    });
   // return posts;
   //console.log("POSTS by AUTHORS ------------->", posts2, "oldPosts", posts);
   return posts2;
  });
};

export const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
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
  });
};

export const createUserSubscribedTo = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    //all subscribers
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
      return results.find((memberType) => memberType.subscriberId === key)?.author;
    });
    console.log('UserSubscribedTo ------------> users', users);
    return users;
  });
};

export const createSubscribedToUser = (prisma: PrismaClient) => {
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