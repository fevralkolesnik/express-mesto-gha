const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
.then(() => console.log('Connected'))
.catch((err) => console.log(`Something goes wrong: ${err}`));

app.use((req, res, next) => {
  req.user = {
    _id: '6433c923c6d64dbc35894af9',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});