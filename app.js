// server.js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
//const db = require('./config/db');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const multer = require('multer');
const upload = multer({dest: './uploads'});
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
const db = mongoose.connection;

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

//bodyParser MiddleWare
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(multer({dest: './uplads'}));
/*app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');*/
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle Sessions
app.use(session({
	secret: 'select',
	saveUninitialized: true,
	resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//express validator and error formatter
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value : value
		};
	}
}));

//connect flash using connect messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', routes);
app.use('/users', users);

app.use(function(req, res, next){
	var err = new Error('Not Found!');
	err.status = 404;
	next(err);
});

//Exprss Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

const port = 8000;

module.exports = app;
