const Sequelize=require("sequelize")
const sequelize=require("../util/database")

const forgotPassword=sequelize.define("forgotPassword",{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    isactive:Sequelize.BOOLEAN
})

module.exports=forgotPassword