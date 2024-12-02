const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    imdbId: String!
    genre: String!
    year: Int!
    director: String!
    createdAt: String
    updatedAt: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
    moviesByGenre(genre: String!): [Movie!]!
    me: User
    checkMovie(imdbId: String!): Boolean!
  }

  type Mutation {
    createMovie(
      title: String!
      imdbId: String!
      genre: String!
      year: Int!
      director: String!
    ): Movie!
    
    updateMovie(
      id: ID!
      title: String
      genre: String
      year: Int
      director: String
    ): Movie!
    
    deleteMovie(id: ID!): Boolean!
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs; 