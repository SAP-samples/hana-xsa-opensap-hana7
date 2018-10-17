	//Simple Database Select Via Client Wrapper/Middelware - Await
	app.get("/await", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(req.db);
			const statement = await db.preparePromisified(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            								 FROM "DUMMY"`);
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				Objects: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});
