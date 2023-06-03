const express = require('express');
const mongoose = require('mongoose');
const DocumentNotFoundError = require('./errors/DocumentNotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6433c923c6d64dbc35894af9',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(() => {
  throw new DocumentNotFoundError('Данная страница не найдена');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { errCode, message } = err;
  res.status(errCode).send({ message });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT);
