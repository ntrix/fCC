const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect(
	"mongodb+srv://nt1:khigio2kDBfcc1@fccdb0.avkln.mongodb.net/fcc1?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

const { Schema } = mongoose;
const personSchema = new Schema(
	{
		username: { type: String, required: true },
		date: String,
		duration: Number,
		description: String,
	},
	{ versionKey: false }
);
const Person = mongoose.model("Person", personSchema);

app.post("/api/exercise/new-user", function (req, res) {
	var uname = req.body.username;
	Person.find({ username: uname }, function (err, data) {
		if (err) res.send(err);
		else {
			if (data.length) res.send("Username already taken");
			else {
				var person = new Person({ username: uname });
				person.save(function (err, data) {
					if (err) res.send(err);
					else res.json({ username: uname, _id: data._id });
				});
			}
		}
	});
});
app.get("/api/exercise/users", function (req, res) {
	Person.find({}).then((data) => {
		var list = [];
		data.forEach((d) => {
			var per = { username: d.username, _id: d._id };
			list.push(per);
		});
		res.json(data);
	});
});

app.post("/api/exercise/add", function (req, res) {
	var userId = req.body.userId;
	Person.findOneAndUpdate(
		{ _id: userId },
		{
			date: (req.body.date
				? new Date(req.body.date)
				: new Date()
			).toDateString(),
			duration: req.body.duration,
			description: req.body.description,
		},
		{ new: true },
		function (err, data) {
			if (err) res.send(err);
			else res.json(data);
		}
	);
});

app.get("/api/exercise/log", function (req, res) {
	Person.find({}).then((data) => {
		var list = [];
		data.forEach((d) => {
			var per = { username: d.username, _id: d._id };
			list.push(per);
		});
		res.json(data);
	});
});

// Not found middleware
app.use((req, res, next) => {
	return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
	let errCode, errMessage;

	if (err.errors) {
		// mongoose validation error
		errCode = 400; // bad request
		const keys = Object.keys(err.errors);
		// report the first validation error
		errMessage = err.errors[keys[0]].message;
	} else {
		// generic or custom error
		errCode = err.status || 500;
		errMessage = err.message || "Internal Server Error";
	}
	res.status(errCode).type("txt").send(errMessage);
});
const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
