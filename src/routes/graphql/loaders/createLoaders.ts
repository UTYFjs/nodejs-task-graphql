
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Post, MemberType, User } from '../types/typesJS.js';

export const createProfileLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = (await prisma.profile.findMany({
      where: {
        userId: { in: ids },
      },
    }));
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
    //get all posts of all authors unsorted
    const results = (await prisma.post.findMany({
      where: {
        authorId: { in: ids },
      },
    }));
    //sorting posts by authors
    const postsByAuthors:Record<string, Post[]> ={};
    results.forEach((post) => {
      let authorPostsCollection = postsByAuthors[post.authorId];
      if(!authorPostsCollection){
        authorPostsCollection = []
      }
      authorPostsCollection.push(post)
      postsByAuthors[post.authorId] = authorPostsCollection;
    })
    // sorting by order key
    const posts = ids.map((key) => {
      return postsByAuthors[key];
    })
   return posts;
  });
};

export const createMemberTypeLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (keys: readonly string[]) => {
    const ids = [...keys];
    const results = (await prisma.memberType.findMany({
      where: {
        id: { in: ids },
      },
    }));
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
    const authors: Record<string, User[]> = {}
    results.forEach((userSubscribedTo) =>{
      let userSubscribedToArr = authors[userSubscribedTo.subscriberId]; 
      if(!userSubscribedToArr){
        userSubscribedToArr = []
      }
      userSubscribedToArr.push(userSubscribedTo.author);
      authors[userSubscribedTo.subscriberId] = userSubscribedToArr;
   })

    const  users = ids.map((key)=>{
      return authors[key];
    }) 
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

     const subs: Record<string, User[]> = {};
     results.forEach((userSubscribedTo) => {
       let userSubscribedToArr = subs[userSubscribedTo.authorId];
       if (!userSubscribedToArr) {
         userSubscribedToArr = [];
       }
       userSubscribedToArr.push(userSubscribedTo.subscriber);
       subs[userSubscribedTo.authorId] = userSubscribedToArr;
     });

     const users = ids.map((key) => {
       return subs[key];
     });
     return users;
  });
};