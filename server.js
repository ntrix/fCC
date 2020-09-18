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

// your first API endpoint...
app.get("/api/timestamp/:date_string?", function (req, res) {
	var dateString = req.params.date_string;

	if (dateString) date = new Date(+dateString ? +dateString : dateString);
	else date = new Date();

	if (date.getTime())
		res.json({ unix: date.getTime(), utc: date.toUTCString() });
	else res.json({ error: "Invalid Date" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
	console.log("Your app is listening on port " + listener.address().port);
});
