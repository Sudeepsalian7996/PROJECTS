const Razorpay=require("razorpay")
const orderDb=require("../models/orderdb")

exports.getPremium=async (req,res,next)=>{
    try{
        const Razor=new Razorpay({
            key_id:"rzp_test_gECQk6X0m86Aj0",
            key_secret:"3nDmL88xzh6JzF3sFIhGT9Fm"
        })
        const amount=2000
        Razor.orders.create({amount,currency:"INR"},async(err,order)=>{
            if(err){
                throw new Error("Error while starting order")
            }
            await orderDb.create(
                {
                    orderId:order.id,
                    status:"PENDING",
                    userId:req.user.id
                })
            res.json({order,key_id:Razor.key_id})
        })
    }catch(err){
        console.log("Razor pay error",err)
        res.json({Error:err})
    }
}

exports.updatePremium=async(req,res,next)=>{
    try{
        const paymentid=req.body.payment_id
        const orderid=req.body.order_id
        
        const result=await orderDb.findOne({where:{orderId:orderid}})
        
        if(paymentid===null){
            res.json({message:"payment is failed"})
          return  result.update({paymentId:paymentid,status:"FAILED"})
        }
        function updateTable(result){
           return new Promise((resolve)=>{
                resolve(result.update({paymentId:paymentid,status:"SUCCESS"}))
           }) 
        }
        function updateUserTable(){
            return new Promise((resolve)=>{
               resolve(req.user.update({premium:true}))
            })
        }
        Promise.all([updateTable(result),updateUserTable()]).then(()=>{
            res.json({success:true,message:"transaction successfull"})
        })
    }catch(err){
        console.log("error in update transaction",err)
        res.json({Error:err})
    }
 
}