import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {  GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import {
  CreatePostInput,
  MemberTypeId,
  MemberTypes,
  PostType,
  CreateProfileInput,
  Profiles,
  CreateUserInput,
  UserType,
  ChangePostInput,
  ChangeUserInput,
  ChangeProfileInput,
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
        type: new GraphQLNonNull(UserType),
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
      deletePost: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, args: { id: string }) => {
          try {
            await new PrismaClient().post.delete({
              where: {
                id: args.id,
              },
            });
            return true;
          } catch (err) {
            return false;
          }
        },
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, args: { id: string }) => {
          try {
            await new PrismaClient().user.delete({
              where: {
                id: args.id,
              },
            });
            return true;
          } catch (err) {
            return false;
          }
        },
      },
      deleteProfile: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, args: { id: string }) => {
          try {
            await new PrismaClient().profile.delete({
              where: {
                id: args.id,
              },
            });
            return true;
          } catch (err) {
            return false;
          }
        },
      },

      changePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangePostInput) },
        },
        resolve: async (_, args: { id: string; dto: Omit<PostInput, 'authorId'> }) => {
          return await new PrismaClient().post.update({
            where: {
              id: args.id,
            },
            data: args.dto,
          });
        },
      },
      changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeUserInput) },
        },
        resolve: async (_, args: { id: string; dto: UserInput }) => {
          return await new PrismaClient().user.update({
            where: {
              id: args.id,
            },
            data: args.dto,
          });
        },
      },
      changeProfile: {
        type: Profiles,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: new GraphQLNonNull(ChangeProfileInput) },
        },
        resolve: async (_, args: { id: string; dto: Omit<ProfileInput, 'userId'> }) => {
          return await new PrismaClient().profile.update({
            where: {
              id: args.id,
            },
            data: args.dto,
          });
        },
      },
      subscribeTo: {
        type: new GraphQLNonNull(UserType),
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, args: { userId: string; authorId: string }) => {
          await new PrismaClient().subscribersOnAuthors.create({
            data: { subscriberId: args.userId, authorId: args.authorId },
          });
          return new PrismaClient().user.findUnique({
            where: { id: args.userId },
          });
        },
      },
      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_, args: { userId: string; authorId: string }) => {
          try {
            await new PrismaClient().subscribersOnAuthors.delete({
              where: {
                subscriberId_authorId: {
                  subscriberId: args.userId,
                  authorId: args.authorId,
                },
              },
            });
          } catch (err) {
            return false;
          }
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
