var express = require("express");
var cors = require("cors");

// require and use "multer"...
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("uploaded_file"), function (
	req,
	res,
	next
) {
	res.json({ name: req.originalName, type: req.mimetype, size: req.size });
});

app.listen(process.env.PORT || 3000, function () {
	console.log("Node.js listening ...");
});
