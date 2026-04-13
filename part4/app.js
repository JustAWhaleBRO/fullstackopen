const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')

const app = express()

mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('Connected to MongDB')
    })
    .catch(e => {
        logger.error('Error connecting to MongoDB', e.message)
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
