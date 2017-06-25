var express = require('express');
var http = require('http');
var app = express();

var pg = require("pg");
const connectionString = "postgres://sbrenchley:sbrenchley_pass@localhost:5432/twitter";

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getTweets', function(request, response) {
	getTweets(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function getTweets(request, response) {
  // first get the tweet's id
  var id = request.query.id;
  getTweetsFromDb(id, function(error, result)) {
    if (error || result == NULL || result.length != 1) {
      response.status(500).json({success: fals, data:error});
    } else {
      var tweet = result[0];
      response.status(200).json(result[0]);
    }
  });
}

function getTweetsFromDb(id, callback) {
  console.log("getting tweet from database with id: " + id);

  var client = new pg.Client(connectionString);
  client.connect(function(err)) {
    if (err) {
      console.log("Error connecting to DB: ");
      console.log(err);
      callback(err, null);
    }

    var sql = "SELECT id, username, content, date_tweeted FROM tweets WHERE id = $1::int";
    var params = [id];

    var query = client.query(sql, params, function(err, result) {
      // we are now done getting the data from the DB, disconnect the client
			client.end(function(err) {
				if (err) throw err;
			});

      if (err) {
				console.log("Error in query: ")
				console.log(err);
				callback(err, null);
			}

			console.log("Found result: " + JSON.stringify(result.rows));

      callback(null, result.rows);
    });
  });
}
