import { gql } from '@apollo/client';

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
      imdbId
      year
      genre
      director
    }
  }
`;

export const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      id
      title
      imdbId
      genre
      year
      director
    }
  }
`;

export const CHECK_MOVIE = gql`
  query CheckMovie($imdbId: String!) {
    checkMovie(imdbId: $imdbId)
  }
`; 