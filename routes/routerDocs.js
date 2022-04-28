const { Router } = require("express")
const path = require("path")
const routerDocs = Router();


routerDocs.get("/", (req, res, next)=>{
  res.sendFile(path.join(__dirname, "../public/index.html"))
})


module.exports = routerDocs;