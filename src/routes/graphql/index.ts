import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import {   graphql } from 'graphql';


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  






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
      //console.log('this is req.body.query  -----> ', query);
      //console.log('this is req.body.variables  ----->', variables);
      const res = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma}
      });
      console.log('это ответ сервера graphql---->', res);
      return res;
    },
  });

  
};

export default plugin;
