const express = require("express");
const app = express();
const port = 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for testing by FCC
var cors = require("cors");

app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/views/index.html");
});

// second API endpoint...
app.use(function(req, res) {
  res.json({
    "ipaddress": req.ip.slice(7),
    "language": req.acceptsLanguages(),
    "software": req.headers['user-agent']
  })
})

// listen for requests :)
var listener = app.listen(port, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
