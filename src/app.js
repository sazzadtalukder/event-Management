const express = require('express');
require('dotenv').config();
const eventRoutes = require('./routes/eventRoute')
const app = express();
const pool = require('./db')
app.use(express.json())
const port = process.env.PORT || 5000;

// app.get('/',(req,res)=>{
//     res.send('My api is running')
// })
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.use('/events',eventRoutes)
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})
