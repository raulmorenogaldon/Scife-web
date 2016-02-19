var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User')

/**
 * Return a list with the users saved in the database
 */
router.get('/', function (req, res) {
  User.find(function (err, users) {
    if (err)res.send(500, err.message)
    res.render('users/index', {users: users})
  })
})

/**
 * Return the user's info whose id is passed as a parameter
 */
router.get('/info/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err)res.send(500, err.message)
    res.render('users/info', {user: user})
  })
})

/**
 * Get the form to add a new user
 */
router.get('/create', function (req, res) {
  res.render('users/create')
})

/**
 * Receive the info to create a new user
 */
router.post('/create', function (req, res) {
  var user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password
  })

  user.save(function (err, user) {
    if (err) return res.status(500).send(err.message)
    res.redirect('/users/')
  })
})

/**
 * Get the form to update the user's info
 */
router.get('/update/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.send(500, err.message)
    res.render('users/update', {user: user})
  })
})

router.post('/update/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.send(500, err.message)

    user.userName = req.body.userName
    user.email = req.body.email
    user.password = req.body.password

    user.save(function (err) {
      if (err) return res.send(500, err.message)
      res.setHeader('Content-type', 'application/json')
      res.status(200)
      res.send(JSON.stringify(user))
    })
  })
})

router.get('/delete/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.send(500, err.message)

    res.render('users/delete', {user: user})
  })
})

router.post('/delete/', function (req, res) {
  User.findById(req.body.id, function (err, user) {
    if (err) return res.send(500, err.message)

    user.remove(function (err) {
      if (err)res.send(500, err.message)
      res.redirect('/users/')
    })
  })
})

module.exports = router
