import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { parse, validate, graphql } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createDataLoader } from './loaders/common.js';


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
      const parsedQuery = parse(query);
      const errorsValidation = validate(schema, parsedQuery, [ depthLimit(5)]);
      if(errorsValidation && errorsValidation.length > 0 ){
        return { errors: errorsValidation}
      }

      const loader = createDataLoader(prisma);

      const response = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, loader}
      });
      //console.log('this is response graphql---->', response.errors);
      return response;
    },
  });

  
};

export default plugin;


