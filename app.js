const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const DocumentNotFoundError = require('./errors/DocumentNotFoundError');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { validationCreateUser, validationLogin } = require('./middlewares/joiValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cors);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use((req, res, next) => {
  next(new DocumentNotFoundError('Данная страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT);

console.log(PORT);
