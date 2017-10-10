var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var exphbs = require("express-handlebars");
var path = require("path");
var d3 = require("d3");

var app = express();
var PORT = process.env.PORT || 3000;

//Starts Server Listening
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

// Sets up the Express app to handle body data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sets up Express to use Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database =============================================================

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "friend_finder_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});


function createRecord() {
  console.log("Inserting a new record...\n");
  var query = connection.query(
    "INSERT INTO records SET ?",
    {
      LTR:newRecord.LTR,
      OSAT:newRecord.OSAT,
      comment:newRecord.comment,
      phone:newRecord.phone,
      email:newRecord.emil
    },
    function(err, res) {
      console.log(res.affectedRows + " record inserted!\n");
    }
    );
  console.log(query.sql);
}




// Routes=============================================================
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "Survey.html"));
});

app.get("/admin", function(req, res) {
  connection.query("SELECT * FROM records;", function(err, data) {
    if (err) throw err;
    res.render("index", { records: data });
  });
});




// get images when requested
app.get("/images/background-1932466_960_720.jpg", function(req, res) {
  res.sendFile(path.join(__dirname, "images/background-1932466_960_720.jpg"));
});



var newRecord;
// Create New records - takes in JSON input
app.post("/api/new", function(req, res) {
  // req.body hosts is the JSON post sent from the user
  // This works because of our body-parser middleware
  newRecord = req.body;
  newRecord.uniqueID = newRecord.email.replace(/\s+/g, "").toLowerCase();
  console.log(newRecord);
  createRecord()
  return res.json("yes");
});
