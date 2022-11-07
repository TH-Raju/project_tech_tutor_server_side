const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());


app.get('/', (req, res) => {
    res.send("API Working...");
})
app.listen(port, () => {
    console.log(`Server Running...${port}`)
})