	//Database Call Stored Procedure With Inputs
	app.get("/procedures2/:partnerRole?", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var partnerRole = req.params.partnerRole;
		var inputParams = "";
		if (typeof partnerRole === "undefined" || partnerRole === null) {
			inputParams = {};
		} else {
			inputParams = {
				IM_PARTNERROLE: partnerRole
			};
		}
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				var result = JSON.stringify({
					EX_BP_ADDRESSES: results
				});
				res.type("application/json").status(200).send(result);
			});
		});
	});
