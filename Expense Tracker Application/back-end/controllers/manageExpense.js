const sequelize=require("../util/database")
const expensedatabase=require("../models/expensedb")
const userdb=require("../models/signupdb");
const downloaddb=require("../models/downloaddb")
const AWS=require("aws-sdk")

var totalamtdb;
//Adding the expense to the database
exports.addExpense=async(req,res)=>{
    try{
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category
        const data=await expensedatabase.create({
            amount:amount,
            description:description,
            category:category,
            userId:expenseId
        })
     
       const user=await userdb.findByPk(totalamtdb.id)
        user.totalAmount=Number(user.totalAmount)+Number(amount)
         user.save()
        res.json({newExpense:data})
    }
    catch(err){
        console.log("addExpense error-->",err)
        res.json({Error:err})
    }
}
let expenseId;
//Fetching all the expenses from the database
exports.getExpense=async(req,res)=>{
    totalamtdb=req.user
    expenseId=req.user.id
    try{
        const data=await expensedatabase.findAll({where:{userId:expenseId}})
        res.json({allExpenses:data})
    }catch(err){
        console.log("error in fetching data from database")
        res.json({Error:err})
    }
}

//deleting the expense from the database
exports.deleteExpense=async(req,res)=>{
    try{
        const deleteExpenseId=req.params.id
        const data= await expensedatabase.findByPk(deleteExpenseId)
        const amt= data.dataValues.amount
        const user=await userdb.findByPk(totalamtdb.id)
        user.totalAmount=Number(user.totalAmount)-Number(amt)
        user.save()
       
       await expensedatabase.destroy({where:{id:deleteExpenseId}})


    }catch(err){
        console.log("error in delete expense database")
        res.json({Error:err})
    }
}

//download expense
exports.download=async (req,res)=>{
    try{
        console.log("user proto-->",userdb.prototype)
       const response=await req.user.getExpenseDetails()
       const stringifiedExpense=JSON.stringify(response)
       const userId=req.user.id
       const filename=`expense${userId}/${new Date()}.txt`
       const fileurl=await uploadtoS3(stringifiedExpense,filename)

       //storing url in download table
       const data=await req.user.createDownload({
        url:fileurl
       })
     const fetchData=await downloaddb.findAll({where:{userId:req.user.id}})
     console.log(fetchData)
       res.json({url:fileurl,alldata:fetchData,success:true})
    }catch(err){
        console.log("error in download file-->",err)
        res.json({Error:err})
    }
}

//upload the expense to AWS S3

async function uploadtoS3(data,filename){
    try{
        const BUCKET_NAME="sdpexpensetrackerapp"
        const IAM_USER_KEY="AKIA4L7OL2S2KS4KRVIU"
        const IAM_USER_SECRETE_KEY="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"
    
        let s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRETE_KEY
        })
        
            var params={
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:data,
                ACL:"public-read"
            }
           return new Promise((resolve,reject)=>{
                s3bucket.upload(params,(err,S3success)=>{
                    if(err){
                        reject("something went wrong in AWS")
                    }else{
                        resolve(S3success.Location)     
                    }
                })
            })
    }catch(err){
        res.json({Error:err,success:false})
        console.log("error in uploading..",err)
    }
  
}

//paginate expenses
exports.paginateExpenses=async(req,res)=>{
    try{
        const page=req.query.page
      const data=  await expensedatabase.findAll({
        offset:(page)*10,
        limit:10,
        where: { userId:req.user.id }
    })
      res.json({Data:data})
    }catch(err){
        console.log("pagination error-->",err)
        res.json({Error:err})
    }
}