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

sequelize.sync({alter:true})
.then(()=>{
    app.listen(5200)
})
.catch((err)=>console.log("sync err-->",err))
