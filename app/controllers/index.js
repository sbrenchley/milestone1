var express = require('express')
var router = express.Router()

// one day we could load a more modular set of routes with something like
// router.use('/comments', require('./comments'))

router.get('/', function(req, res) {
  res.render('home')
})

router.get('/getTweets', function(req, res) {
  // TODO call the twitters
})

module.exports = router
