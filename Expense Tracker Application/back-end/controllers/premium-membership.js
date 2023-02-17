const User=require("../models/signupdb")
const Expense=require("../models/expensedb")
const expense=require("../models/expensedb")
const sequelize = require("../util/database")

exports.premiumFeature=async(req,res,next)=>{
    try{
       const leaderBoardofUser= await User.findAll({
            attributes:["id","name",[sequelize.fn("sum",sequelize.col("expensedetails.amount")),"total_amount"]],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
            group:["users.id"],
            order:[["total_amount","DESC"]]
        })
        res.json(leaderBoardofUser)
    }catch(err){
        console.log('error in premiumFeature-->',err)
        res.json({Error:err})
    }
}