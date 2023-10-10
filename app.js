const express = require('express')
const path = require('path')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/users')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


app.use('/api/contacts', contactsRouter)
app.use('/users', usersRouter)
app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

module.exports = app
