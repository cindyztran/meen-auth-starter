//Dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
//require express session
const session = require('express-session');

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));



//Middleware
//Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true}));

//configure express sessions
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);

//Routes / Controllers
const userController = require('./controllers/users');

//mount server routes to /users 
app.use('/users', userController);

const sessionsController = require('./controllers/sessions');

//mount /sessions
app.use('/sessions', sessionsController);

app.get('/', (req, res) => {
    res.render('index.ejs');
});


//Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`));

