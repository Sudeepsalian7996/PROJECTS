const Sequelize=require("sequelize")
const sequelize=new Sequelize("expenses","root","$alian7996",{
    dialect:"mysql",
    host:"localhost"
})

module.exports=sequelize