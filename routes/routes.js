const express = require('express')
const router = express.Router()

const User = require('../models/user')
const Dog = require('../models/dog')

const passport = require('../helpers/passportInfo')
const loginBlock = require('../helpers/loginBlock')

const baseController = require('../controllers/homeController')
const authController = require('../controllers/authController')

// ----- Login & Logout-----

router.get('/', function (req, res) {
  res.render('home')
})

router.get('/login', function (req, res) {
  res.render('users/login')
})

router.post('/users/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/members',
    failureRedirect: '/login',
    failureFlash: 'Invalid email and/or Password',
    successFlash: 'You are logged in'
  })(req, res, next)
})

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('success', 'You have logged out')
  res.redirect('/')
})


// ----- Sign Up -----

router.get('/signup', function (req, res) {
    res.render('users/signup')
  })

router.post('/users/signup', authController.signup)


router.get('/new', function (req, res) {
    res.render('dogs/new')
  });


// ----- Read Database -----

router.get('/welcome', loginBlock, function (req, res) {
  Dog.find({}, function (error, dogs) {
    if (error) {
      console.log(error)
      return
    }

    res.render('users/welcome', { allDogs: dogs })
    console.log(dogs)
  })
})


router.get('/members', loginBlock, function (req, res) {

  Dog.find({}, function (error, dogs) {
    if (error) {
    console.log(error)
    return
  }

  res.render('users/members', { allDogs: dogs })
  console.log(dogs)
})
})


// ----- Edit -----

router.get('/editform/:id', function (req, res) {
  Dog.findById(req.params.id, function (error, dog) {
    if (error) {
      console.log(error)
      return
    }
    res.render('users/editform', {'dog': dog})
  })
})


router.put('/editform/:id', function (req, res) {
  Dog.findOneAndUpdate({
    _id: req.params.id
  },

    {$set: {
        name: req.body.name,
        breed: req.body.breed,
        date: req.body.dob,
        size: req.body.size,
        gender: req.body.gender,
        temperament: req.body.temperament
    }},
    function (error) {
      if (error) {
        console.log(error)
      } else {
        res.redirect('/members')
      }
    })
})


// ----- Delete -----

router.delete('/delete/:id', function (req, res) {
  console.log(req.params.id)

  Dog.remove({'_id': req.params.id}, function (error, docs) {
    if (error) return error
    console.log(docs)
    res.redirect('/members')
  })
})


// ------ Create Dog Details ------

router.get('/new', loginBlock, function (req, res) {
  res.render('dogs/new')
})


router.post('/dogs/new', function (req, res) {
  console.log('begin')
  console.log(req.user.id)
  console.log('end')

  let entry = new Dog()
  entry.name = req.body.name
  entry.breed = req.body.breed
  entry.dob = req.body.dob
  entry.gender = req.body.gender
  entry.size = req.body.size
  entry.temperament = req.body.temperament
  entry.user = req.user.id

  console.log(entry)

  Dog.create(entry, (err) => {
    if (err) console.log(err)
    res.redirect('/members')
  })
})

// ----- Search -----

router.get('/search', function (req, res) {
  res.render('users/search')
})

router.post('/search', function (req, res) {
  Dog.find({ breed: req.body.breed }, function (error, result) {
    if (error) console.log(error)
    res.send(result)
  })
})

// ----- Contact Us -----

router.post('/users/contactus', function (req, res) {
  res.send('Thank you for your message. We will reply you soon.')
})

// ----- Newsletter Subscription -----

router.post('/users/subscribe', function (req, res) {
  res.send('Thank you for subscribing to our newsletter.')
})

// ----- Report -----

router.get('/report', function (req, res) {
  res.render('users/report')
})

router.post('/users/report', function (req, res) {
  res.send('Thank you, we will look into this matter soon.')
})

// ----- Forgot Password -----
router.get('/forgot', function (req, res) {
  res.render('users/forgot')
})

router.post('/users/forgot', function (req, res) {
  res.send('We have emailed you a link to reset your password.')
})

module.exports = router
