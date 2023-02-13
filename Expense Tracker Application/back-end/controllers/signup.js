const signupdb=require("../models/signupdb")


const signup=async(req,res)=>{
   const name=req.body.name
   const email=req.body.email
   const password=req.body.password

  const data=await signupdb.create({
    name:name,
    email:email,
    password:password
   })
   res.json({newData:data})
}

module.exports=signup