const sequelize=require("../util/database")
const expensedatabase=require("../models/expensedb")
const userdb=require("../models/signupdb")

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
    //     console.log(totalamtdb.totalAmount)
    //    const total=Number(totalamtdb.totalAmount)+Number(amount)
       
    //    console.log(total)
    //   await userdb.update({
    //     totalAmount:total
    //    },{
    //     where:{id:totalamtdb.id
    //     }
    //    })
    //    await t.commit()
        res.json({newExpense:data})
    }
    catch(err){
        // await t.rollback()
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
       const data=await expensedatabase.destroy({where:{id:deleteExpenseId}})
    }catch(err){
        console.log("error in delete expense database")
        res.json({Error:err})
    }
}