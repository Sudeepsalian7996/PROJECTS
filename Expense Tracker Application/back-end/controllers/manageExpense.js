const expensedatabase=require("../models/expensedb")

//Adding the expense to the database
exports.addExpense=async(req,res)=>{
    try{
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category
        console.log(amount,description,category)
        const data=await expensedatabase.create({
            amount:amount,
            description:description,
            category:category
        })
        res.json({newExpense:data})
    }
    catch(err){
        console.log("addExpense error-->",err)
        res.json({Error:err})
    }
}

//Fetching all the expenses from the database
exports.getExpense=async(req,res)=>{
    try{
        const data=await expensedatabase.findAll()
        res.json({allExpenses:data})
    }catch(err){
        console.log("error in fetching data from database")
        res.json({Error:err})
    }
}

//deleting the expense from the database
exports.deleteExpense=async(req,res)=>{
    try{
        const expenseId=req.params.id
       const data=await expensedatabase.destroy({where:{id:expenseId}})
    }catch(err){
        console.log("error in delete expense database")
        res.json({Error:err})
    }
}