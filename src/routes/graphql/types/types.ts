import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

//todo all interfaces for all entities
interface UserInterface {
  id: string;
  name: string;
  balance: number;
  //posts?: Array<T>;
}

export const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  description: 'This is for MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const MemberTypeId  = new GraphQLEnumType({name: "MemberTypeId", values:{
  basic: {value: 'basic'},
  business: {value: 'business'}
}})

export const PostType = new GraphQLObjectType({
  name: 'posts',
  description: 'this is posts type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  description: 'posts input',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  })
})
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
export const UserType = new GraphQLObjectType({
  name: 'users',
  description: 'this is users type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },

    profile: {
      type: Profiles,
      /*resolve: async (parent) => {
        return await new PrismaClient().profile.findMany({where: {
          userId: parent.id,
        }})
      }*/
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent: UserInterface) => {
        return await new PrismaClient().post.findMany({where: {
          authorId: parent.id,
        }})
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(new GraphQLNonNull(UserType)),
      resolve: async (parent, args, context, info) => {
        console.log ("PARENT -------------------->", parent);
        const authors = await new PrismaClient().subscribersOnAuthors.findMany({
          where: {
            subscriberId: parent.id,
          },
          
          include: {author:true},
        });
        console.log('authors with subscriberId ------>', authors);
        console.log('this is parent.id -------->', parent.id);
        return authors.map((author) => author.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(new GraphQLNonNull(UserType)),
      resolve: async (parent, args, context: FastifyInstance, info) => {
        const prisma = new PrismaClient();
        const authors = await prisma.subscribersOnAuthors.findMany({
          where: {
            authorId: parent.id,
          },
          include: {subsriber:true},
        });
        console.log('authors with authorId ------>', authors);
        console.log('this is parent.id -------->', parent.id);
        return authors.map((author) => author.subsriber);
      },
    },
  }),
});
/*export const SubscribersOnAuthors = new GraphQLObjectType({
  name: 'subscribersOnAuthors',
  description: 'this is SubscribersOnAuthors type',
  fields: () => ({
    subsriber: { type: UserType },
    subscriberId: { type: GraphQLString },
    author: { type: UserType },
    authorId: { type: GraphQLString },
    id: {type: GraphQLID},
  }),
});*/

export const Profiles = new GraphQLObjectType({
  name: 'profiles',
  description: 'this is profiles type',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: {type: new GraphQLNonNull(MemberTypeId)},
    memberType: {type: MemberTypes,
    /*resolve: async (parent) =>{
        return await new PrismaClient().memberType.findUnique({
          where: {
            id: parent.memberTypeId,
          },
        });
    }*/
  }
  }),
});


 