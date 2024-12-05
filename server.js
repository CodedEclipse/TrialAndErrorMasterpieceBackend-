const express = require('express');
const app = express();
const port = 9696;
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/db.js');

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.authenticate();

app.use('/admin', require('./routes/admin.route'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(process.env.PORT, () => {
  console.log(``);
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
