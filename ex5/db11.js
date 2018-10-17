	app.get("/org", (req, res) => {
		let VCAP = JSON.parse(process.env.VCAP_APPLICATION);
		return res.type("application/json").status(200).send(JSON.stringify(VCAP.organization_name));
	});

	app.get("/space", (req, res) => {
		let VCAP = JSON.parse(process.env.VCAP_APPLICATION);
		return res.type("application/json").status(200).send(JSON.stringify(VCAP.space_name));
	});
