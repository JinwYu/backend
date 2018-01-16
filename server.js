var express = require('express');
var app = express(); // Grants access to the functions in the express-module.
var mongojs = require('mongojs');
var db = mongojs('user:test@localhost:33423/gamedb', ['gamecollection']); //url, collection
var bodyParser = require('body-parser');



// Find the html, js and css-files.
app.use(express.static(__dirname)); 
// "static" means that it will use the html, js, css-files.
// because they don't change when the app is running.

/*app.use(function(req, res, next) {  
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
});  */

/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
*/

// Npm package to allow cross-domain operations like: get, put, post, delete etc.
app.use(require('cors')());

/*
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
*/

// Our server can now parse the data from the body.
app.use(bodyParser.json());

app.get('/gamelist', function (req, res){
    console.log("The server has received a get request.");

    db.gamecollection.find(function(error, gameobject){
        res.json(gameobject);
        console.log("Returned the data to the controller.")
    });
});

// Insert data to the database.
app.post('/gamelist', function(req, res){
    console.log(req.body);
    var newGame = req.body;
    // Insert the data to the database.
    db.gamecollection.insert(newGame, function(err, dbObject){
        console.log("The new item has successfully been inserted to the database.");
        // Send the data back to the controller.
        res.json(dbObject);
    });

});

// Delete an object from the database.
app.delete('/gamelist/:id', function(req, res){
    var id = req.params.id;
    //console.log(id);

    // Remove the object from the database.
    db.gamecollection.remove({_id: mongojs.ObjectId(id)}, function (err, doc){
        console.log("The item has been deleted from the server.");
        // Send the removed object back to the controller.
        res.json(doc);
    });
});

// Edit/update an existing object in the database.
app.put('/gamelist/:id', function(req, res) {
    var id = req.params.id;
    //console.log(req.params.id);

    db.gamecollection.findAndModify({
        query: {_id: mongojs.ObjectId(id)},
        update: {$set: {title: req.body.title, platform: req.body.platform, 
                        genre: req.body.genre, price: req.body.price,
                        comment: req.body.comment}},
        new: true}, function (err, doc) {
            //console.log(doc);
            console.log("The item has been modified in the database.")
            res.json(doc);
        }
    );
});


app.listen(8000);
console.log("Backend server running on port 8000");

