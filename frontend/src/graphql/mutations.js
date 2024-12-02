import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const ADD_MOVIE = gql`
  mutation CreateMovie(
    $title: String!
    $imdbId: String!
    $genre: String!
    $year: Int!
    $director: String!
  ) {
    createMovie(
      title: $title
      imdbId: $imdbId
      genre: $genre
      year: $year
      director: $director
    ) {
      id
      title
      imdbId
      genre
      year
      director
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie(
    $id: ID!
    $title: String
    $genre: String
    $year: Int
    $director: String
  ) {
    updateMovie(
      id: $id
      title: $title
      genre: $genre
      year: $year
      director: $director
    ) {
      id
      title
      year
      genre
      director
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($input: FavoriteMovieInput!) {
    addToFavorites(input: $input) {
      id
      tmdbId
      title
      year
      poster
      rating
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($movieId: ID!) {
    removeFromFavorites(movieId: $movieId)
  }
`;

export const GET_FAVORITE_MOVIES = gql`
  query GetFavoriteMovies {
    favoriteMovies {
      id
      tmdbId
      title
      year
      poster
      rating
    }
  }
`;

export const CHECK_MOVIE = gql`
  query CheckMovie($imdbId: String!) {
    checkMovie(imdbId: $imdbId)
  }
`; 