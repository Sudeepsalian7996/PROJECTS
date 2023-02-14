const express=require("express")

const routes=express.Router()

const manageExpense=require("../controllers/manageExpense")

routes.post("/add-expense",manageExpense.addExpense)

routes.get("/get-expense",manageExpense.getExpense)

routes.delete("/delete-expense/:id",manageExpense.deleteExpense)

module.exports=routes
