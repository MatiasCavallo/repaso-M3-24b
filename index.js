const express = require("express");
const routerApi = require("./routes/routerApi.js")
const routerDocs = require("./routes/routerDocs.js")
const app = express()

app.use(express.json())


app.get("/hola" , (req, res, next)=>{
  res.send("hola")
})

app.use("/", routerDocs)
app.use("/api", routerApi)


//endware
app.use( (error, req, res, next)=>{
  console.log(error)
  res.status(500).send({msg_error: "Ups! 🙈"})
})


app.listen(3000, ()=>{
  console.log("Server listening on port 3000");
})
