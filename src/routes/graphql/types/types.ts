import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { ContextValue, MemberType, Post, Profile, User } from './typesJS.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'this is user type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: User, _, { prisma, loader }: ContextValue, info) => {
        ///await loader.post.load(parent.id);
        return await prisma.post.findMany({
          where: {
            authorId: parent.id,
          },
        });
      },
    },
    profile: {      
      type: Profiles as GraphQLObjectType,
      resolve: async (parent: User, _, { prisma, loader }: ContextValue) => {
        return await prisma.profile.findUnique({
          where: {
            userId: parent.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _, { prisma, loader }: ContextValue, info) => {
        return await prisma.user.findMany({ where: {subscribedToUser: {some: {subscriberId : parent.id} }}, });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _, { prisma, loader }: ContextValue, info) => {
        return await prisma.user.findMany({
          where: {
            userSubscribedTo: { some: { authorId: parent.id}},
          },

        });

      },
    },
  }),
});

export const Profiles = new GraphQLObjectType({
  name: 'profiles',
  description: 'this is profiles type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    //memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    memberType: {
      type: MemberTypes,
      resolve: async (parent: Profile, _, { prisma, loader }: ContextValue) => {
        return await  prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
      },
    },
    //userId: { type: new GraphQLNonNull(UUIDType) },
    user: {type: new GraphQLNonNull(UserType),
    resolve: async (parent: Profile, _ , {prisma, loader}:ContextValue, ) => {
      return await prisma.user.findUnique({where: { id: parent.userId}})
    }}
  }),
});


export const PostType = new GraphQLObjectType({
  name: 'posts',
  description: 'this is posts type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    /*author: {
      type: UserType as GraphQLObjectType,
      resolve: async (parent: Post, _, { prisma, loader }: ContextValue) => {
        return await prisma.user.findUnique({ where: { id: parent.authorId } });
      },
    },*/
  }),
});

export const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  description: 'This is for MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    /*profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (parent: MemberType, _, { prisma, loader }: ContextValue) => {
        return await prisma.profile.findMany({where:{memberTypeId: parent.id}})
      },
    },*/
  }),
});

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  description: 'posts input',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'user input',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'profile input',
  fields: () => ({
    userId: { type: GraphQLString },
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  description: 'posts input for change',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  description: 'user input for change',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  description: 'profile input for change',
  fields: () => ({
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});
 