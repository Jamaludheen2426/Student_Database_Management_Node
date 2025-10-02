const { type } = require('os');
const {Sequelize, DataTypes, Model} = require('sequelize');
const db = require('../config/db.config');

class Student extends Model
{

}
Student.init(
{
    Id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    Name:
    {
        type:DataTypes.STRING,
        allowNull:false,
    },
    Mark:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    Active:
    {
        type:DataTypes.ENUM,
        values : ['T','F'],
        allowNull:false,
    },
},
{
    sequelize : db.getInstance(),
    modelName:'Student',
    tableName:'Student',
    timestamps:false
}
);

module.exports = Student;