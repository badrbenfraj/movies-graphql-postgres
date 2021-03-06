const { makeExecutableSchema } = require('graphql-tools')
const reqdir = require('require-dir')
const Mutation = reqdir('./resolvers/mutations')
const Query = reqdir('./resolvers/queries')

const typeDefs = `
  type Movie @cacheControl(maxAge: 1800) {
    actors: [String]
    backdrop: String
    countries: [String]
    directors: [String]
    genres: [String]
    id: String
    imdb_id: String
    languages: [String]
    composers: [String]
    title: String
    overview: String
    production_companies: [String]
    producers: [String]
    poster: String
    release_date: String
    # Users rating of the movie
    rating: Int
    runtime: Int
    tagline: String
    title: String
    tmdb_id: String
    user: User
    # How many times the user has watched the movie
    views: [String]
    # Does the movie contain the Wilhelm scream?
    wilhelm: Boolean
    writers: [String]
    year: String
  }

  type ViewDate {
    date: String
    userId: Int
  }

  type View {
    movie_id: Int
    title: String
    dates: [ViewDate]
    views_count: Int
  }

  enum PersonType {
    actor
    composer
    director
    producer
    writer
  }

  input RatingInput {
    # ID in DB
    movieId: String!
    # New rating
    rating: Int!
  }

  input MovieInput {
    # IMDb ID or IMDb URL
    imdbId: String!
    rating: Int = 0
    # View date
    date: String
    # The famous Wilhelm Scream
    wilhelm: Boolean = false
  }

  type CountWithYear @cacheControl(maxAge: 1800) {
    count: Int
    year: String
  }

  type PersonInMovies @cacheControl(maxAge: 1800) {
    name: String
    number_of_movies: Int
    ranking: Int
  }

  type Watches @cacheControl(maxAge: 1800) {
    views_with_rewatches: Int
    total_views: Int
  }

  type Runtime @cacheControl(maxAge: 1800) {
    days: Int
    minutes: Int
    hours: Int
    years: Float
  }

  type RuntimeWithAdjusted @cacheControl(maxAge: 1800) {
    total_with_rewatches: Runtime
    total: Runtime
  }

  type Ratings @cacheControl(maxAge: 1800) {
    rating: Int
    user: User
  }

  type User @cacheControl(maxAge: 86400) {
    email: String
    id: Int
    name: String
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type ToplistMovie {
    average_rating: Float
    number_of_ratings: Int
    id: String
    imdb_id: String
    title: String
    overview: String
    release_date: String
    runtime: Int
    tagline: String
    title: String
    tmdb_id: String
    # Does the movie contain the Wilhelm scream?
    wilhelm: Boolean
    year: String
  }

  # The allowed mutations
  type Mutation {
    insertMovie(input: MovieInput!): Movie
    updateRating(input: RatingInput!): Movie
    register(input: RegisterInput!): User
    login(input: LoginInput!): Token
  }

  type Query {
    # Return a feed of all users watches or
    # if provided with an ID only one users feed
    feed(limit: Int = 50, offset: Int = 0): [Movie]!
    friends: [User]!

    # Takes an required ID that can be either
    # the ID in the database OR an IMDb ID (i.e. tt0180093)
    movie(id: String!): Movie
    movies(limit: Int = 50, offset: Int = 0): [Movie]
    bestForYears(ranking: Int!): [Movie]
    moviesPerYear(year: String): [CountWithYear]
    moviesWithRating(rating: Int!): [Movie]
    person(name: String!, role: PersonType!): [Movie]
    
    # Our version of the IMDb Top 250
    top250(limit: Int = 250, offset: Int = 0): [ToplistMovie]

    # All users ratings for a specific movie
    ratings(movieId: Int!): [Ratings]!
    totalByPerson(
      role: PersonType!
      ranked: Int = 10
      name: String
    ): [PersonInMovies]
    totalByRole(role: PersonType!): Int
    users(id: Int): [User]!
    userMoviesPerYear: [CountWithYear]

    # Total amounts of time spent watching movies,
    # both for single views and adjusted with rewatches
    userRuntime: RuntimeWithAdjusted
    views(offset: Int = 0, limit: Int = 10): [View]
    watches: Watches
  }
`

const resolvers = {
  Mutation,
  Query,
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
})
