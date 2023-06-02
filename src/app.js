const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6433c923c6d64dbc35894af9',
  };

  res.message = {
    400: 'Переданы некорректные данные',
    404: 'По указанному _id ничего не найдено',
    505: 'Ошибка по-умолчанию',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send(res.message[404]);
});

app.listen(PORT);
