const passport = require('../helpers/passportInfo')
const User = require('../models/user');
// const Dog = require('../models/dog');


//------ Get Sign Up Page -----
exports.register = (req, res) => {
    res.render("users/signup")
};


//------ Get Login Page -----
exports.login = (req, res) => {
    res.render("users/login")
};


//------ Get Logout Page -----
exports.logout = (req, res) => {
    req.logout()
    req.flash("You are logged out!")
    redirect("/users/login")
};

// ----- Sign Up Fields (POST) -----
exports.signup = (req, res) => {

    req.checkBody('firstname', 'First Name Required').notEmpty();
    req.checkBody('lastname', 'Last Name Required').notEmpty();
    req.checkBody('email', 'Email Required').notEmpty();
    req.checkBody('password', 'Password Required').notEmpty();
    req.checkBody('passwordRetype', 'Retype Password').notEmpty();
    if (req.body.passwordRetype) {
      req.checkBody('passwordRetype', 'Password entered does not match').equals(req.body.password);
    }

    let errors = req.validationErrors()
    console.log(errors);

        if (errors) {
            res.render('users/signup', { errors : errors, data: req.body
        });

        } else {

        User.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            password: req.body.password
            }, (error, createdUser) => {

        if (error) {
            console.log(error)
            req.flash('error', 'Could not create user account');
            res.redirect('/users/signup');

        } else {
            passport.authenticate('local', {
            successRedirect: '/welcome',
            successFlash: 'Account created and logged in'})(req, res);
            }
        })
    }
  }


//   exports.dog = (req,res) => {
//     let currentUser = req.session.passport.user
//     Dog.find({dogs : currentUser}).exec((err, data) => {
//       if (err) console.log(err)
//       if (data != "" || data != null) {
//         res.render('home/index',{"results":data})
//       }
//       else {
//         res.render('home/index')
//       }
//     })
//   }

