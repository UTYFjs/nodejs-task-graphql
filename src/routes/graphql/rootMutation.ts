import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import {
  CreatePostInput,
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
import { ContextValue, PostInput, ProfileInput, UserInput } from './types/typesJS.js';

export const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInput },
      },
      resolve: async (_, args: { dto: PostInput }, { prisma }: ContextValue) => {
        return prisma.post.create({ data: args.dto });
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: CreateUserInput },
      },
      resolve: async (_, args: { dto: UserInput }, { prisma }: ContextValue) => {
        return prisma.user.create({ data: args.dto });
      },
    },
    createProfile: {
      type: Profiles,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (_, args: { dto: ProfileInput }, { prisma }: ContextValue) => {
        return prisma.profile.create({ data: args.dto });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_, args: { id: string }, { prisma }: ContextValue) => {
        try {
          await prisma.post.delete({
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
      resolve: async (_, args: { id: string }, { prisma }: ContextValue) => {
        try {
          await prisma.user.delete({
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
      resolve: async (_, args: { id: string }, { prisma }: ContextValue) => {
        try {
          await prisma.profile.delete({
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
      resolve: async (
        _,
        args: { id: string; dto: Omit<PostInput, 'authorId'> },
        { prisma }: ContextValue,
      ) => {
        return await prisma.post.update({
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
      resolve: async (
        _,
        args: { id: string; dto: UserInput },
        { prisma }: ContextValue,
      ) => {
        return await prisma.user.update({
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
      resolve: async (
        _,
        args: { id: string; dto: Omit<ProfileInput, 'userId'> },
        { prisma }: ContextValue,
      ) => {
        return await prisma.profile.update({
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
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        { prisma }: ContextValue,
      ) => {
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: args.userId, authorId: args.authorId },
        });
        return prisma.user.findUnique({
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
      resolve: async (
        _,
        args: { userId: string; authorId: string },
        { prisma }: ContextValue,
      ) => {
        try {
          await prisma.subscribersOnAuthors.delete({
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
