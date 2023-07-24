import { PrismaClient } from '@prisma/client';
import {
  createProfileLoader,
  createPostLoader,
  createMemberTypeLoader,
  createUserSubscribedTo,
  createSubscribedToUser,
} from './createLoaders.js';

export const createDataLoader = (prisma: PrismaClient) => {
  return {
    profile: createProfileLoader(prisma),
    post: createPostLoader(prisma),
    memberType: createMemberTypeLoader(prisma),
    userSubscribedTo: createUserSubscribedTo(prisma),
    subscribedToUser: createSubscribedToUser(prisma),
  };
};
