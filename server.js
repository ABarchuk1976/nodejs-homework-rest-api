const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const contactsRouter = require('./routes/contactRoutes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

mongoose
  .connect(
    'mongodb+srv://abarchuk1976:ab1976AB@abarchuk1976.w5c0x7b.mongodb.net/db-contacts?retryWrites=true&w=majority'
  )
  .then((con) => {
    console.log('Mongo DB successfully connected..');
  })
  .catch((err) => {
    console.log(err);

    process.exit(1);
  });

const port = 3000;

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status } = err;
  res.status(status || 500).json({ message: err.message });
  next();
});

app.listen(port, () => {
  console.log('Server running. Use our API on port: 3000');
});
