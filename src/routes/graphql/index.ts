import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLList, GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import { MemberTypes, Posts, Profiles, Users } from './types/types.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      memberTypes: {
        type: new GraphQLList(MemberTypes),
        //args: {}
        resolve: async (_: unknown, __: unknown) => {
          //return prisma.memberType.findMany();
          return await prisma.memberType.findMany();
        },
      },
      posts: {
        type: new GraphQLList(Posts),
        resolve: async (_: unknown, __: unknown) => {
          //return prisma.memberType.findMany();
          return await prisma.post.findMany();
        },
      },
      users: {
        type: new GraphQLList(Users),
        //args: {}
        resolve: async (_: unknown, __: unknown) => {
          //return prisma.memberType.findMany();
          return await prisma.user.findMany();
        },
      },
      profiles: {
        type: new GraphQLList(Profiles),
        //args: {}
        resolve: async (_: unknown, __: unknown) => {
          //return prisma.memberType.findMany();
          return await prisma.profile.findMany();
        },
      },
    },
  });

  const schema = new GraphQLSchema({
    query: RootQuery,
  });


  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables} =req.body;
      console.log('this is req.body.query  -----> ', query);
      //console.log('this is req.body.variables  ----->', variables);
      const res = await graphql(
        {schema: schema,
        source: query,}
      )
      console.log("это ответ сервера ---->", res)
      return res;
    },
  });




  
};

export default plugin;
