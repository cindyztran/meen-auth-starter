require('dotenv').config();

//Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//require express session
const session = require('express-session');
const methodOverride = require('method-override');

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
        saveUninitialized: false,
    })
);

app.use(methodOverride('_method'));

//Routes / Controllers
const userController = require('./controllers/users');

//mount server routes to /users 
app.use('/users', userController);

const sessionsController = require('./controllers/sessions');

//mount /sessions
app.use('/sessions', sessionsController);

//Index
app.get('/', (req, res) => {
    //if user is logged in: render dashboard view
    if (req.session.currentUser) {
        res.render('dashboard.ejs', {
            currentUser: req.session.currentUser
        });
    } else {
        //if user is logged out: render index view
        res.render('index.ejs', {
            //include current user data
            currentUser: req.session.currentUser

        });

    }
});





//Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`));

