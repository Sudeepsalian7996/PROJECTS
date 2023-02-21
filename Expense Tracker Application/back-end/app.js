const express=require("express")
const bodyParser=require("body-parser")
const cors=require("cors")

const signup=require("./routes/user")
const expenseDetail=require("./routes/expense")
const purchase=require("./routes/purchase")
const premium=require("./routes/premium")
const password=require("./routes/forgotPassword")
const sequelize=require("./util/database")

const User=require("./models/signupdb")
const Expense=require("./models/expensedb")
const Order=require("./models/orderdb")
const ForgotPassword=require("./models/forgotPassworddb")
const Download=require("./models/downloaddb")

const app=express()
app.use(cors())
app.use(bodyParser.json())

app.use("/user",signup)

app.use("/expense",expenseDetail)

app.use("/purchase",purchase)

app.use("/premium",premium)

app.use("/password",password)

//create relations
User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPassword)
ForgotPassword.belongsTo(User)

User.hasMany(Download)
Download.belongsTo(User)

sequelize.sync()
.then(()=>{
    app.listen(5200)
})
.catch((err)=>console.log("sync err-->",err))
