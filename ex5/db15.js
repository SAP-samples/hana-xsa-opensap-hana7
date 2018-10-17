	app.get("/osUser", (req, res) => {
		var exec = require("child_process").exec;
		exec("whoami", (err, stdout, stderr) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			} else {
				res.type("text/plain").status(200).send(stdout);
			}
		});
	});
