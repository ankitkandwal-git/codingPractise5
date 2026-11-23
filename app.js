const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')
const app = express()
let db = null
app.use(express.json())
const dbPath = path.join(__dirname, `moviesData.db`)

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running')
    })
  } catch (error) {
    console.log('Server is Running')
  }
}
initializeDbAndServer()

const convertMovieObj = obj => {
  return {
    movieId: obj.movie_id,
    directorId: obj.director_id,
    movieName: obj.movie_name,
    leadActor: obj.lead_actor,
  }
}

const directorObj = obj => {
  return {
    directorId: obj.director_id,
    directorName: obj.director_name,
  }
}
// API 3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovie = `SELECT * FROM movie WHERE movie=${movieId};`
  const movie = await db.get(getMovie)
  response.send(convertMovieObj(movie))
})

// api 1

app.get('/movies/', async (request, response) => {
  const getMovie = `SELECT * FROM movie;`
  const movieres = await db.all(getMovie)
  response.send(
    movieres.map(eachMovie => ({
      movieName: eachMovie.movie_name,
    })),
  )
})
