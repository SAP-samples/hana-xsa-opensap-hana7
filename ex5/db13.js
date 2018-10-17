	app.get("/hdb", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			const statement = await dbConn.preparePromisified(
				`SELECT FROM PurchaseOrder.Item { 
			                 POHeader.PURCHASEORDERID as "PurchaseOrderId", 
			                 PRODUCT as "ProductID", 
			                 GROSSAMOUNT as "Amount" } `
			);
			const results = await dbConn.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				PurchaseOrders: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});
