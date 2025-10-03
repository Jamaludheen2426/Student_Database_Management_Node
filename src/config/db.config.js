const Sequelize = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//      process.env.DB_NAME,
//      process.env.DB_USER,
//      process.env.DB_PASS,
//     {
//         host : process.env.DB_HOST,
//         port : process.env.DB_PORT,
//         dialect : process.env.DB_DIALECT,
//     }
// );

class Database
{
    constructor()
    {
        this.sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host : process.env.DB_HOST,
            port : process.env.DB_PORT,
            dialect : process.env.DB_DIALECT,
        })
    }

    async connect()
    {
        try
        {
            await this.sequelize.authenticate();
            await this.sequelize.sync({alter : true});
            console.log("Database Connected Sucessfully");
        }
        catch(e)
        {
            console.log("Some Issue in Connection",{e});
            throw new Error('Database connection error: ' + e.message);
        }
    }

    getInstance()
    {
        return this.sequelize;
    }

};
module.exports = new Database();