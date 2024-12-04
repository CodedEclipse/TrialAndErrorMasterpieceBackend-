const express = require('express');
const app = express();
const port = 9696;
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./config/db.js');
const generateModels = require('./config/generateModels.js');

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize.authenticate();

app.use('/admin', require('./routes/admin.route'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/ganrateModel', (req, res) => {
  try {
    generateModels();
    res.status(201).json({ status: true, code: 200, message: 'Models have been generated successfully', result:null });
  } catch (error) {
    res.status(400).json({ status: false, code: 404, message: error.message, result:null });
  }
});

app.listen(process.env.PORT, () => {
  console.log(``);
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
