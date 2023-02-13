const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const signup=sequelize.define("users",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        allowNull:false,
        type:Sequelize.STRING
    },
    email:{
        allowNull:false,
        type:Sequelize.STRING,
        unique:true
    },
    password:{
        allowNull:false,
        type:Sequelize.STRING
    }
})

module.exports=signup