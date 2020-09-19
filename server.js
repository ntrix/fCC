const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect(
	process.env.MONGO_URI,
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
	{ username: { type: String, required: true } },
	{ versionKey: false }
);
const Persons = mongoose.model("Persons", personSchema);

const exSchema = new Schema(
	{
		foreignId: { type: String, required: true },
		date: Date,
		duration: Number,
		description: String,
	},
	{ versionKey: false }
);
const Exercises = mongoose.model("Exercises", exSchema);

app.post("/api/exercise/new-user", function (req, res) {
	var username = req.body.username;
	Persons.find({ username: username }, function (err, data) {
		if (err) throw new err;
		if (data.length) res.send("Username already taken");

		var person = new Persons({ username: username });
		person.save(function (err, data) {
			if (err) throw new err;
			res.json(data);
		});
	});
});

app.get("/api/exercise/users", function (req, res) {
	Persons.find({}).then((d) => res.json(d));
});

app.post("/api/exercise/add", function (req, res) {
	var id = req.body.userId,
		date = req.body.date ? new Date(req.body.date) : new Date();
	var username;
	var e = new Exercises({
		foreignId: id,
		date: date,
		duration: req.body.duration,
		description: req.body.description,
	});
	var exJson = {
		_id: id,
		date: date.toDateString(),
		duration: e.duration,
		description: e.description,
	};

	Persons.findById(id, "username", function (err, data) {
		if (err) throw new err;
		else username = data.username;

		if (username) exJson.username = username;
		e.save(function (err) {
			if (err) throw new err;
			else res.json(exJson);
		});
	});
});

app.get("/api/exercise/log", function (req, res) {
	var id = req.query.userId,
		fromDate = req.query.from ? req.query.from : new Date(0),
		toDate = req.query.to ? req.query.to : new Date();

	Persons.findById(id, function (err, person) {
		if (err) throw new err;

		if (req.query.limit)
			Exercises.find({ foreignId: id }, "description duration date", done);
		else
			Exercises.find(
				{ foreignId: id, date: { $gte: fromDate, $lte: toDate } },
				"description duration date",
				done
			);

		function done(err, ex) {
			var result = [];
			if (err) throw new err;
			for (let e of ex) {
				if (req.query.limit-- == 0) break;
				result.push(
					(e = {
						description: e.description,
						duration: e.duration,
						date: e.date.toDateString(),
					})
				);
			}
			res.json({
				_id: id,
				username: person.username,
				count: result.length,
				log: result,
			});
		}
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
})