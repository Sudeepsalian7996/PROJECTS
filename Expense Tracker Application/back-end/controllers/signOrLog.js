const signupdb=require("../models/signupdb")

//sign up 
exports.signup=async(req,res)=>{
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

//Login
exports.login=async(req,res)=>{
   try{
      const email=req.body.email
      const password=req.body.password
      const emaildb=await signupdb.findAll({where:{email:email}})
      const passworddb=await signupdb.findAll({where:{password:password}})
      
      if(emaildb[0]===undefined){
         res.json({message:"Enter a valid Email.."})
      }else if(passworddb[0]===undefined){
         res.json({message:"Enter a valid Password.."})
      }else{
        res.json({success:"login Successfully Done"})
      }
 
   }catch(err){
      console.log("error in login BE")
      res.json({Error:err})
   }
}

