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
import { ContextValue } from './types/typesJS.js';


export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypes as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        //work loader
        //const res = loader.memberType.load(args.id);
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
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.post.findMany();
      },
    },
    post: {
      type: PostType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        const res = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return res;
      },
    },
    //users: {type: new GraphQLList(UserType)},
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        const res = await prisma.user.findUnique({ where: { id: args.id } });
        return res;
      },
    },

    profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.profile.findMany();
      },
    },
    profile: {
      type: Profiles as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        //work load
        //const res =  loader.profile.load(args.id);
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

/*export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypes,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        //work loader
        //const res = loader.memberType.load(args.id);
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
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        const res = await prisma.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return res;
      },
    },
    //users: {type: new GraphQLList(UserType)},
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma, loader }: ContextValue,
      ) => {
        const res = await prisma.user.findUnique({where: { id: args.id,  } });
        return res;
      },
    },

    profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (_: unknown, __: unknown, { prisma, loader }: ContextValue) => {
        return await prisma.profile.findMany();
      },
    },
    profile: {
      type: new GraphQLNonNull(Profiles),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_: unknown, args: { id: string },{ prisma, loader }: ContextValue) => {
        //work load
        //const res =  loader.profile.load(args.id);
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
*/