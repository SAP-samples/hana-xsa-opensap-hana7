	app.get("/env", (req, res) => {
		return res.type("application/json").status(200).send(JSON.stringify(process.env));
	});
