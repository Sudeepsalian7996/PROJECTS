const sib=require("sib-api-v3-sdk")
require("dotenv").config()


exports.forgotpassword=async(req,res)=>{
    try{
        const email=req.body.email
        
        const client=sib.ApiClient.instance
        
        const apiKey=client.authentications['api-key']
        apiKey.apiKey=process.env.API_KEY
        console.log("api key-->",process.env.API_KEY)
    
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
            textContent:"this is the test content used for testing purpose"
        })

        console.log(data)
    }catch(err){
        console.log("error in forgot password-->",err)
        res.json({Error:err})
    }

}
