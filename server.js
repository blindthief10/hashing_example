const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./userModel');
const morgan = require('morgan');

app.listen(4000, () => console.log('Server is listening'));

mongoose.set('useNewUrlParser', true);

const connectMongo = async () => {
  try {
    console.log('Trying to connect to mongo');
    await mongoose.connect('mongodb://localhost:27017/example');
    console.log('Connected to local mongo instance');
  } catch(error) {
    console.log(error);
  }

}

connectMongo();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/users/create', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    await userModel.create(req.body);
    res.status(201).json({message: 'User was created'});
  }catch(error) {
    next(error);
  }
});

app.get('/users', async (req, res, next) => {
  try {

    const userFound = await userModel.findOne({userName: req.body.userName});

    if (!userFound) {
      return res.status(404).json({message: 'User does not exist'})
    }

    const checkedPassword = await bcrypt.compare(req.body.password, userFound.password);

    if (!checkedPassword) {
      return res.status(404).json({message: 'Password invalid'});
    }

    const dataToBeGiven = {firstName: userFound.firstName, lastName: userFound.lastName, userName: userFound.userName}

    res.status(200).json({userInfo: dataToBeGiven});

  }catch (error) {
    next(error);
  }
})


app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status).json({message: err.message})
})
