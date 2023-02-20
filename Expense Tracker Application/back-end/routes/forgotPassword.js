const express=require("express")
const forgotPassword=require("../controllers/forgotsib")

const routes=express.Router()

routes.post("/forgotpassword",forgotPassword.forgotpassword)

module.exports=routes
