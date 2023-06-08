const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const sessions = require('express-session')
const cookieParser = require('cookie-parser')

const indexRouter = require('./routes/index')
const candidatRouter = require('./routes/candidat')
const recruterRouter = require('./routes/recruter')
const adminRouter = require('./routes/admin')

const apiRouter = require('./routes/api')
const cors = require('cors')

const app = express()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessions({
  secret: 'moncodesercretquepersonnenedoitconnaitre',
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 2 },
  resave: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/candidat', candidatRouter)
app.use('/recruter', recruterRouter)
app.use('/admin', adminRouter)

app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
