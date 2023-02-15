const express=require("express")
const bodyParser=require("body-parser")
const cors=require("cors")

const signup=require("./routes/user")
const expenseDetail=require("./routes/expense")
const sequelize=require("./util/database")

const User=require("./models/signupdb")
const Expense=require("./models/expensedb")

const app=express()
app.use(cors())
app.use(bodyParser.json())

app.use("/user",signup)

app.use("/expense",expenseDetail)

//create relations
User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync()
.then(()=>{
    app.listen(5200)
})
.catch((err)=>console.log("sync err-->",err))
