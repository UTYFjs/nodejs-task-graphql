import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {  GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, graphql } from 'graphql';
import {
  CreatePostInput,
  MemberTypeId,
  MemberTypes,
  PostType,
  CreateProfileInput,
  Profiles,
  CreateUserInput,
  UserType,
} from './types/types.js';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { PostInput, ProfileInput, UserInput } from './types/typesSimple.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberTypes),
        resolve: async (_: unknown, __: unknown) => {
               return await prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberTypes,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeId) },
        },
        resolve: async (_: unknown, args: { id: string }, context) => {
          console.log('контекст ----->', context);
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
        resolve: async (_: unknown, __: unknown) => {
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
        resolve: async (_: unknown, __: unknown) => {
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
        resolve: async (_: unknown, args: { id: string }, context) => {
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
        resolve: async (_: unknown, __: unknown) => {
          return await prisma.profile.findMany();
        },
      },
      profile: {
        type: Profiles,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_: unknown, args: { id: string }, context) => {
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

  const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createPost: {
        type: PostType,
        args: {
          dto: { type: CreatePostInput },
        },
        resolve: async (_, args: { dto: PostInput }) => {
          return new PrismaClient().post.create({ data: args.dto });
        },
      },
      createUser: {
        type: UserType,
        args: {
          dto: { type: CreateUserInput },
        },
        resolve: async (_, args: { dto: UserInput }) => {
          return new PrismaClient().user.create({ data: args.dto });
        },
      },
      createProfile: {
        type: Profiles,
        args: {
          dto: { type: CreateProfileInput },
        },
        resolve: async (_, args: { dto: ProfileInput }) => {
          return new PrismaClient().profile.create({ data: args.dto });
        },
      },
      /*createPost: {
        type: PostType,
        args: { dto: { type: new GraphQLNonNull(PostInputType) } },
        resolve: (parent, { dto }) => {
          return new PrismaClient().post.create({ data: dto });
        },
      },*/
      /*createUser: {
        type: UserType,
        args: { dto: new GraphQLNonNull(GraphQLString) },
      },*/
    },
  });
  const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
  });


  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
        404: Type.Null(),
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      console.log('this is req.body.query  -----> ', query);
      console.log('this is req.body.variables  ----->', variables);
      const res = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
      });
      console.log('это ответ сервера ---->', res);
      return res;
    },
  });

  
};

export default plugin;
