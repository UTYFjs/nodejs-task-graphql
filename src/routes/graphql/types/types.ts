import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, 
  GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, 
  GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

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
      resolve: async (parent: User, _, { loader }: ContextValue) => {
        //working
        const posts =  await loader.post.load(parent.id);
        console.log("RESULTS POST FROM DATALOADER --------->", posts);
      return [posts]; 
       /*return await prisma.post.findMany({
          where: {
            authorId: parent.id,
          },
        });*/
      },
    },
    profile: {      
      type: Profiles as GraphQLObjectType,
      resolve: async (parent: User, _, { loader }: ContextValue) => {
                return await loader.profile.load(parent.id);
        /*return await prisma.profile.findUnique({
          where: {
            userId: parent.id,
          },
        });*/
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _, { loader }: ContextValue) => {
        console.log(
          'THIS IS PARENT FROM USERSUBSCRIBEDTO------------------------->',
          parent.subscribedToUser,
        );
         const res = await loader.userSubscribedTo.load(parent.id);
         return [res];
        /*return await prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: parent.id } } },
        });*/
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _, { loader }: ContextValue) => {
        
        const res = await loader.subscribedToUser.load(parent.id);
        //console.log('ТО ЧТО ВЫВОДИТ SubscribedTOUSER --------------->>', res);
        
        return [res];
        /* const result = await prisma.user.findMany({
          where: {
            userSubscribedTo: { some: { authorId: parent.id}},
          },

        });
        console.log ('ТО ЧТО ВЫВОДИТ SubscribedTOUSER --------------->>', result)
        return result;*/

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
    memberType: {
      type: MemberTypes as GraphQLObjectType,
      resolve: async (parent: Profile, _, { loader }: ContextValue) => {
        return await loader.memberType.load(parent.memberTypeId);
        //return await  prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
      },
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    user: {type: new GraphQLNonNull(UserType),
    resolve: async (parent: Profile, _ , {prisma}:ContextValue, ) => {
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
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType as GraphQLObjectType,
      resolve: async (parent: Post, _, { prisma }: ContextValue) => {
        return await prisma.user.findUnique({ where: { id: parent.authorId } });
      },
    },
  }),
});

export const MemberTypes = new GraphQLObjectType({
  name: 'memberTypes',
  description: 'This is for MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(Profiles),
      resolve: async (parent: MemberType, _, { prisma }: ContextValue) => {
        return await prisma.profile.findMany({where:{memberTypeId: parent.id}})
      },
    },
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
 