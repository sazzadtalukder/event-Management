const {Pool} = require('pg');
require('dotenv').config();

// const pool = new Pool({
//     user: "postgres",
//     host: 'localhost',
//     database: "eventmanagement",
//     password: "Ppassword1@",
//     port: 5432
// })

const pool = new Pool({
    connectionString: process.env.DB_URL,
});


pool.connect()
.then(client =>{
    console.log("Database Connected ...")
})
.catch(err=>console.log(`Database connectio error`,err.stack))
module.exports = pool