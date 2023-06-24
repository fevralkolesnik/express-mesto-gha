const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const DocumentNotFoundError = require('./errors/DocumentNotFoundError');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { validationCreateUser, validationLogin } = require('./middlewares/joiValidation');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/users/signup', validationCreateUser, createUser);
app.post('/users/signin', validationLogin, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new DocumentNotFoundError('Данная страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
