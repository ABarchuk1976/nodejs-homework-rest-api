const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const contactsRouter = require('./routes/contactRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();
dotenv.config({ path: './.env' });

const formatsLogger = process.env.NODE_ENV === 'development' ? 'dev' : 'short';

mongoose
  .connect(process.env.MONGO_URL)
  .then((con) => {
    console.log('Mongo DB successfully connected..');
  })
  .catch((err) => {
    console.log(err);

    process.exit(1);
  });

const port = process.env.PORT || 4000;

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', authRouter);
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
