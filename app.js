const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const engine = require('ejs-mate');
const piggybankRoutes = require('./routes/piggy-bank')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')
const userRoutes = require('./routes/users')

mongoose.connect('mongodb://localhost:27017/mihu')
    .then(()=>{
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
// app.use(passport.initialize);
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use('/piggy-bank', piggybankRoutes)
app.use('/secret-code', userRoutes)


app.get('/', (req, res) => {
    res.render('home')
})



app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    res.status(statusCode).send(message)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})