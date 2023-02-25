const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const orderDb=sequelize.define("orderList",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentId:Sequelize.STRING,
    orderId:Sequelize.STRING,
    status:Sequelize.STRING
})

module.exports=orderDb