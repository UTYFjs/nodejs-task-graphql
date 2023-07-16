import { Type } from '@fastify/type-provider-typebox';
import { buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLID } from 'graphql';
import { Prisma, PrismaClient } from '@prisma/client';
export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

//const prisma = Prisma.Prisma__PostClient
/* const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  description: 'This is for MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
const Posts = new GraphQLObjectType({
  name: 'posts',
  description: 'this is posts type',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const Users = new GraphQLObjectType({
  name: 'users',
  description: 'this is users type',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const Profiles = new GraphQLObjectType({
  name: 'profiles',
  description: 'this is profiles type',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberTypes),
      //args: {}
      resolve: async (_: unknown, __: unknown) => {
        //return prisma.memberType.findMany();
        return await PrismaClient.prototype.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(Posts),
      resolve: async (_: unknown, __: unknown) => {
        //return prisma.memberType.findMany();
        return await PrismaClient.prototype.post.findMany();
      },
    },
    users: {
      type: new GraphQLList(Users),
      //args: {}
      resolve: async (_: unknown, __: unknown) => {
        //return prisma.memberType.findMany();
        return await PrismaClient.prototype.user.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(Profiles),
      //args: {}
      resolve: async (_: unknown, __: unknown) => {
        //return prisma.memberType.findMany();
        return await PrismaClient.prototype.profile.findMany();
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
})*/