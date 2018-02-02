// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const 
  mongodb = require("mongodb"),
  mongoClient = mongodb.MongoClient,
  db_user = "taha",
  db_password = "taha",
  host = "ds117878.mlab.com",
  port = "17878",
  schema = "fcc-url-shortner",
  connection_url = `mongodb://${db_user}:${db_password}@${host}:${port}/${schema}`    ;




// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get("/id/:id", (request, response) => {
  let connection_cb = function(err, client){
    if(err) throw err;
    
    client.db('fcc-url-shortner').collection('urls')
      .findOne({shorthand: request.params["id"]}, (err, doc) =>{
          doc.shorthand = 'https://fcc--url-shortner.glitch.me/' + doc.shorthand;
          response.redirect(doc.url);
    });
    client.close;
  }
  mongoClient.connect(connection_url, connection_cb);

});
app.get("/new/*" ,function(request, response) {
  let urlRegEx = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  
  let result = urlRegEx.exec(request.params["0"]);
  if(result === null) {response.setHeader('Content-Type', 'application/json'); response.send(JSON.stringify({error: "You have entered a wrong URL."}));}
  
  else{
  let connection_cb = function(err, client){
    if(err) throw err;
    
    
    client.db('fcc-url-shortner').collection('urls')
      .count({url: result[0]}, (err, count) => {
        console.log(err || count)
        if(err) response.send(err.name);
        if(!count) 
          client.db('fcc-url-shortner').collection('urls').insert({url: result[0], shorthand: Number(Math.random() * 1000).toFixed(0)})
        client.db('fcc-url-shortner').collection('urls').findOne({url: result[0]}, (err, doc) => {
          doc.shorthand = 'https://fcc--url-shortner.glitch.me/' + doc.shorthand;
          response.send(doc);
        });
      
      client.close();
    });
    console.log('Connected to db');
  }
  
  mongoClient.connect(connection_url, connection_cb);
  
  console.log(request.params, result)
  }// response.send(result[0]);
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
