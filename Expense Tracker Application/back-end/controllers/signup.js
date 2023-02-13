const signupdb=require("../models/signupdb")


const signup=async(req,res)=>{
   try{
      const name=req.body.name
      const email=req.body.email
      const password=req.body.password
   
     const data=await signupdb.create({
       name:name,
       email:email,
       password:password
      })
      res.json({newData:data})
   }catch(err){
      console.log("signup err")
      res.json({Error:err})
   }
  
}

module.exports=signup