import { GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId } from './typesGraphQL.js';



export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  description: 'posts input',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'user input',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString)  },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});
export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'profile input',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull( GraphQLInt) },
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
    name: { type: new GraphQLNonNull(GraphQLString) },
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
