const express=require("express")
const bodyParser=require("body-parser")
const cors=require("cors")

const signup=require("./routes/user")
const sequelize=require("./util/database")

const app=express()
app.use(cors())
app.use(bodyParser.json())

app.use("/user",signup)

sequelize.sync()
.then(()=>{
    app.listen(5200)
})
.catch((err)=>console.log("sync err-->",err))
