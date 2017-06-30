var express = require('express')
var router = express.Router()

var twit = require('twit')

//
// one day we could load a more modular set of routes with something like
// router.use('/comments', require('./comments'))

router.get('/', function(req, res) {
  res.render('home')
})

router.get('/getTweets', function(req, res) {
  var twitter = new twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
    timeout_ms:           60 * 1000,  // optional HTTP request timeout to apply to all requests.
  })

  twitter.get(
    'search/tweets',
    { q: '"i\'m ' + req.query.search_term + '"', count: 5 },
    function(err, data, response) {
      res.setHeader('Content-Type', 'application/json');

      var list_items = data.statuses.map(function (tweet) {

        var full_tweet = tweet.text.replace(
          new RegExp(req.query.search_term, 'ig'),
          "<em>$&</em>"
        );

        return [
          '<li class="' + req.query.html_class + '">',
            '<span class="large">',
              full_tweet,
            '</span>',
          '</li>'
        ].join('');
      });

      res.send(JSON.stringify(list_items));
    }
  )
})

module.exports = router
