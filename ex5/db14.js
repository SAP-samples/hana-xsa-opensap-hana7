	app.get("/os", (req, res) => {
		var os = require("os");
		var output = {};

		output.tmpdir = os.tmpdir();
		output.endianness = os.endianness();
		output.hostname = os.hostname();
		output.type = os.type();
		output.platform = os.platform();
		output.arch = os.arch();
		output.release = os.release();
		output.uptime = os.uptime();
		output.loadavg = os.loadavg();
		output.totalmem = os.totalmem();
		output.freemem = os.freemem();
		output.cpus = os.cpus();
		output.networkInfraces = os.networkInterfaces();

		var result = JSON.stringify(output);
		res.type("application/json").status(200).send(result);
	});
