const express = require("express");
const app = express();
const port = 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for testing by FCC
var cors = require("cors");
app.get("/", function (req, res) {
	res.send("<h1>Server index</h1>");
});

app.listen(port, () => {
	console.log("App is listening on port: " + port);
});
