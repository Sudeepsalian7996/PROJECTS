const express=require("express")

const routes=express.Router()

const signup=require("../controllers/signup")

routes.post("/",signup)

module.exports=routes
