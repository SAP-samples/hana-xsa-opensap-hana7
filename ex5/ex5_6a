	//Simple Database Select Via Client Wrapper/Middelware - Promises
	app.get("/promises", (req, res) => {
		const dbClass = require(global.__base + "utils/dbPromises");
		let db = new dbClass(req.db);
		db.preparePromisified(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            	 FROM "DUMMY"`)
			.then(statement => {
				db.statementExecPromisified(statement, [])
					.then(results => {
						let result = JSON.stringify({
							Objects: results
						});
						return res.type("application/json").status(200).send(result);
					})
					.catch(err => {
						return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					});
			})
			.catch(err => {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			});
	});
