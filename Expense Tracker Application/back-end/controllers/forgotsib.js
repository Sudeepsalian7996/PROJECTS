const sib=require("sib-api-v3-sdk")
const uuid=require("uuid")
const encrypt=require("bcrypt")
const user=require("../models/signupdb")
const forgotpassword=require("../models/forgotPassworddb")
require("dotenv").config()


exports.forgotpassword=async(req,res)=>{
    try{
        const email=req.body.email
        
        const userFound=await user.findOne({where:{email:email}})
        if(userFound){
            // console.log(userFound.__proto__)
                const id=uuid.v4()
                await userFound.createForgotPassword({
                        id,
                        isactive:true
                })
                const client=sib.ApiClient.instance
            
                const apiKey=client.authentications['api-key']
                apiKey.apiKey=process.env.API_KEY
            
                const transEmailApi=new sib.TransactionalEmailsApi()
            
                const sender={
                    email:"sudeepsalian7996@gmail.com"
                }
            
                const receivers=[
                    {
                        email:email
                    }
                ]
            
            const data= await transEmailApi.sendTransacEmail({
                    sender,
                    to:receivers,
                    subject:"this is the test subject",
                    htmlContent:`
                    <a href="http://localhost:5200/password/resetpassword/${id}">Reset password</a>
                    `
                })
        
                console.log(data)
                res.json({forgotdata:data,success:true})
        }else{
            console.log("user doesn't exist")
            res.json({message:"user doesnt exist",success:false})
        }
       
    }catch(err){
        console.log("error in forgot password-->",err)
        res.json({Error:err})
    }

}

exports.resetpassword=async (req,res)=>{
    try{
        const id=req.params.id
        const forgotPassword=await forgotpassword.findOne({where:{id:id}})
        if(forgotPassword){
        await forgotPassword.update({active:false})
                        res.send(`<html>
                                         <script>
                                             function formsubmitted(e){
                                                 e.preventDefault();
                                                 console.log('called')
                                             }
                                         </script>
                                         <form action="/password/updatepassword/${id}" method="get">
                                             <label for="newpassword">Enter New password</label>
                                             <input name="newpassword" type="password" required></input>
                                             <button>reset password</button>
                                         </form>
                                     </html>`
                                     )
                        res.end()
        }
    }catch(err){
        console.log("reset password error")
        res,json({Error:err})
    }
}

exports.updatepassword=async (req,res)=>{
    try{
        const { newpassword } = req.query;
        const {resetpassword}=req.params
        const findUser=  await forgotpassword.findOne({where:{id:resetpassword}})
        const data=await user.findOne({where:{id:findUser.userId}})
       if(data){
        const hash=encrypt.hash(newpassword,10,async(err,hash)=>{
            if(err){
                res.json({Error:err})
            }     
            const data2=await data.update({password:hash})
            console.log(data2)    
             res.json({data:data2})
        })
    }
    }catch(err){
        console.log("update passwor error-->",err)
        res.json({Error:err})
    }
   
}