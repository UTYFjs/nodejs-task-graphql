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
} from './types/typesGraphQL.js';
import { UUIDType } from './types/uuid.js';
import { ContextValue, User } from './types/typesJS.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';


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
      type: MemberTypes as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma }: ContextValue,
      ) => {
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
      type: PostType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma }: ContextValue
      ) => {
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
      resolve: async (_: unknown, __: unknown, { prisma, loader}: ContextValue, info) => {
        const parsedInfo = parseResolveInfo(info);
        const isUserSubscribedTo =!!parsedInfo?.fieldsByTypeName.User['userSubscribedTo'];
        const isSubscribedToUser =!!parsedInfo?.fieldsByTypeName.User['subscribedToUser'];
        const users = await prisma.user.findMany({
           include: {
             userSubscribedTo: isUserSubscribedTo,
             subscribedToUser: isSubscribedToUser,
           },
        });

        if(isUserSubscribedTo){
          const subs = {};
          users.forEach((user)=> {
            subs[user.id] = user.userSubscribedTo.map((sub)=> {
              const subId = sub.subscriberId;
              return users.find((user) => user.id === subId)
            })
          })
          const arrFromSubs = Object.entries(subs);
          arrFromSubs.forEach((sub) => {
            const user = sub[1] as User[];
            loader.userSubscribedTo.prime(sub[0] , user[0]);
          })
        }
         

        if (isSubscribedToUser) {
          const authors = {};
          users.forEach((user) => {
            authors[user.id] = user.userSubscribedTo.map((sub) => {
              const subId = sub.subscriberId;
              return users.find((user) => user.id === subId);
            });
          });
          const arrFromAuthors = Object.entries(authors);
          arrFromAuthors.forEach((sub) => {
            const user = sub[1] as User[];
            loader.subscribedToUser.prime(sub[0], user[0]);
          });
        }
         return users;
      },
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma }: ContextValue,
      ) => {
        const res = await prisma.user.findUnique({ where: { id: args.id } });
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
      type: Profiles as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _: unknown,
        args: { id: string },
        { prisma }: ContextValue,
      ) => {
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
