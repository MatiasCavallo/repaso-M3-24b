const { default: axios } = require("axios");
const { Router } = require("express");

const routerApi = Router()
let movies = []
let reviews = []


function* generateMovieId(){
  let id = 1;
  while(true){
    yield id;
    id++
  }
}

const getNewId = generateMovieId();


function createMovie({ title, image, description, genre }){
  let movie = {
    title,
    image,
    description,
    rating: 0,
    genre,
    id: getNewId.next().value
  }
  movies.push(movie)

  return { msg_message : "Movie created!"}
}

function updateMovie(id, movie){
  const movieToUpdate = movies.find((m)=> m.id === id )
  if(!movieToUpdate) return { msg_error: "Movie not found"}


  movieToUpdate.title = movie.title
  movieToUpdate.description = movie.description
  movieToUpdate.image = movie.image
  movieToUpdate.genre = movie.genre

  return { msg_message: "Movie update!"}
}

function deleteMovie(id){
  if(!movies.find((m)=> m.id === id )) return { msg_error : "ID invalid!"}
  movies = movies.filter(  (m)=> m.id !== id    )
  return { msg_message: "Movie delete!"}
}

function getMovieById(id){
  const movie = movies.find((m)=> m.id === id )
  if(!movie) return { msg_error: "Movie not found"}
  return movie
}
/**
 * 
 * id:
 * rating
 * description
 */
function addReview(review){
  const { id, rating, description } = review
  if(!id || !rating || !description ) return { msg_error: "Faltan valores para crear la review"}
  const movie = movies.find((m)=> m.id === id )
  if(!movie) return { msg_error: "Movie not found"}
  reviews.push(review)
  const allReview = reviews.filter((r)=>  r.id === id)

 const sumReviews =  allReview.reduce(
    (acc, current) => {
      return acc + current.rating
    }
    ,
    0
  )
  movie.rating = sumReviews / allReview.length

  return { msg_message: "Review agrega con exito!"}
}
function getReviewByMovieId(id){
  if(!movies.find((m)=> m.id === id )) return { msg_error : "ID invalid!"}
  const allReview = reviews.filter((r)=>  r.id === id)
  return allReview
}


// const express= require("express");

// const routerApi = express.Router()
// const routerApi = require("express").Router();

routerApi.get("/", (req, res, next)=>{
  if(!movies.length) return res.send({msg_error: "No hay peliculas"})
  return res.json(movies)
})

routerApi.post("/movie", (req, res, next)=>{
  const { title, image, description, genre } = req.body;
  if(!title || !image || !description || !genre ) return res.send({ msg_error: "Faltan datos!"})
  res.send(
    createMovie({
      title,
      image,
      description,
      genre
    })
  )
})


routerApi.get("/reviews/:movieId", (req, res, next)=>{
  const { movieId } = req.params;
  res.send(getReviewByMovieId(parseInt(movieId)))
})


routerApi.post("/review", (req, res, next)=>{
    const { movieId, rating, description } = req.body;
    res.send(addReview({
      id: movieId, 
      rating, 
      description
    }))
})


routerApi.get("/movie", (req, res, next)=>{
try {
  
  const { movieId } = req.query;
  if( !movieId ) return res.send({ msg_error : "ID is required!"})

  res.send(getMovieById(parseInt(movieId)))

} catch (error) {
  next(error)
}

})  


routerApi.get("/getUsers", (req, res ,next)=>{

  axios.get("https://jsonplaceholder.typicode.com/users")
  .then((response)=>{
    res.json(response.data)
  })
  .catch((error)=>{
    next(error)
  })
})
routerApi.get("/getUsersAsync", async (req, res ,next)=>{
  try{
  const response = await axios.get("https://jsonplaceholder.typicode.com/users")
  res.json(response.data)
  }
  catch(error){
    next(error)
  }
  // axios.get("https://jsonplaceholder.typicode.com/users")
  // .then((response)=>{
  //   res.json(response.data)
  // })
  // .catch((error)=>{
  //   next(error)
  // })

})
module.exports = routerApi