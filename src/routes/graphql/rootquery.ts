import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import {
  MemberTypeId,
  MemberTypes,
  PostType,
  Profiles,
  UserType,
} from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { ContextValue } from './types/typesSimple.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve: async (_: unknown, __: unknown, { prisma }: ContextValue) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypes,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_: unknown, args: { id: string }, { prisma }: ContextValue) => {
        const res = await prisma.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
        return res;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_: unknown, __: unknown, { prisma }: ContextValue) => {
        return await prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: { id: string }, { prisma }: ContextValue) => {
        const res = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return res;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_: unknown, __: unknown, { prisma }: ContextValue) => {
        return await prisma.user.findMany({
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
          },
        });
      },
    },
    user: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: { id: string }, { prisma }: ContextValue) => {
        const res = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            //posts: true,
            //userSubscribedTo:  true
            /*{
                
                include: {
                  author: true,
                },
              },*/
            //subscribedToUser: true
            /*{
                include: {
                  subsriber: true,
                },
              },*/
          },
        });
        return res;
      },
    },

    profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (_: unknown, __: unknown, { prisma }: ContextValue) => {
        return await prisma.profile.findMany();
      },
    },
    profile: {
      type: Profiles,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: { id: string }, { prisma }: ContextValue) => {
        const res = await prisma.profile.findUnique({
          where: {
            id: args.id,
          },
        });
        return res;
      },
    },
  },
});
