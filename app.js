// Module Dependencies ==========================================================================
const bodyParser = require('body-parser') // read the form, access POST requests
const cookieParser = require('cookie-parser') // read cookie file for auth
const express = require('express')
const app = express() // init App
const session = require('express-session') // connect flash to display message (encrypt)

const MongoStore = require('connect-mongo')(session);
const expressValidator = require('express-validator') // validate form
const methodOverride = require('method-override'); // access PUT / DELETE
const bcrypt = require('bcrypt')

const mongoose = require('mongoose') // write to database using schema
const exphbs = require('express-handlebars')
const path = require('path') // working with public file and directory path

const multer = require('multer')


// // Set Storage Engine ====================================================================
// const storage = multer.diskStorage ({
//   destination: './public/uploads/',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init Upload
// const upload = multer ({
//   storage: storage,
//   limits:{fileSize: 1000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('myImage');

// // Check File Type
// function checkFileType(file, cb){

// // Allowed extension
//   const filetypes = /jpeg|jpg|png|gif/;

// // Check extension
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
// // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }


// Set Port ======================================================================================
const flash = require('connect-flash')
const passport = require('passport')
const port = process.env.PORT || 3013

const dbConfig = require('./config/dbConfig')


// Models - Routes ================================================================================
const routes = require('./routes/routes')   // const is defined, cannot be re-assigned


// Configuration ================================================================================

// ----- Connect to Database -----
mongoose.Promise = global.Promise
mongoose.connect(dbConfig.url, {
  useMongoClient : true }).then(() => {
    console.log("-- Mongoose ok ---")},
    (err) => { console.log(err) });


// ------ Set Up Express Application / Body-Parser Middleware -----
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json())// get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))


// ----- Set Static Path to Public Folder / View Engine -----
app.use(express.static(path.join(__dirname, 'public')));  // Store all HTML in view folders
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// ----- Express Session To Track Logins -----
app.use(session({
  name: 'doap',
  secret: 'pp2',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore ({
    url: dbConfig.url,
    ttl: 00 * 00 * 00 * 10,
    autoRemove: 'native'
  }),
  cookie: {
    maxAge: 00 * 00 * 10 * 10 * 1000
  }
}));

// ----- Passport -----
app.use(passport.initialize());
app.use(passport.session());


// ----- Connect Flash For Flash Messages Stored In Session -----
app.use(flash());


// Global Variances ==============================================================================
app.use((req, res, next) => {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
  });


// Express Validator ==============================================================================
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }

      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  app.use(methodOverride('_method'));


// Routes ==================================================================================
app.use('/', routes);

app.listen(port, () => {
  console.log('express-connected');
})
