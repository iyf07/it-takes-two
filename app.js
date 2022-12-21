const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const userRoutes = require('./routes/user')
const piggybankRoutes = require('./routes/piggy-bank')
const issueRoutes = require("./routes/issue");
const prizeRoutes = require('./routes/prize')
const Currency = require("./models/currency");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/it-takes-two';

mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch(err => {
        console.log('Mongo connection error: ', err)
    })

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(flash());
app.use('/issue', issueRoutes)
app.use('/piggy-bank', piggybankRoutes)
app.use('/user', userRoutes)
app.use('/prize', prizeRoutes)

app.get('/', (req, res) => {
    res.redirect('/piggy-bank')
})

app.get('/wheel-of-fortune', async (req, res) => {
    const currency = await Currency.find({})
    themecolor = '#ff0000;'
    res.render('wheel-of-fortune/main', {currency, themecolor})
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!!', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).send(message)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

module.exports = app;