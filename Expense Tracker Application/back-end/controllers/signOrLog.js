const signupdb=require("../models/signupdb")
const encrypt=require("bcrypt")

//sign up 
exports.signup=async(req,res)=>{
   try{
      const name=req.body.name
      const email=req.body.email
      const password=req.body.password
      if(email==="" || password==="" || name===""){
         return res.json({success:false,message:"Fill all the fields"})
      }
      encrypt.hash(password,10,async(err,hash)=>{
         console.log("encryption error-->",err)
         const data=await signupdb.create({
            name:name,
            email:email,
            password:hash
           }) 
           res.json({success:true,message:"SignUp successfull"})
      })
   
   }catch(err){
      console.log("signup err")
      res.json({success:false,message:"User already exist..please signup with new Email and Password"})
   }
  
}

//Login
exports.login=async(req,res)=>{
   try{
      const email=req.body.email
      const password=req.body.password
      if(email==="" || password===""){
         return res.json({message:"Email or password missing"})
      }

      const emaildb=await signupdb.findAll({where:{email:email}})
      
      if(emaildb.length>0){
         encrypt.compare(password,emaildb[0].password,(err,result)=>{
            if(err){
               throw new Error("Something went wrong in decypting password")
            }
            console.log(result)
            if(result===true){
               res.json({success:"login Successfully Done"})
            } else{
               res.json({message:"Password is incorrect.."})
            }
         })
      }
     else{
         res.json({message:"User does not exist"})
      }
 
   }catch(err){
      console.log("error in login BE")
      res.json({Error:err})
   }
}

