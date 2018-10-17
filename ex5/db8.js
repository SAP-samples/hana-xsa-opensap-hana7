	//Call 2 Database Stored Procedures in Parallel
	app.get("/proceduresParallel/", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var inputParams = {
			IM_PARTNERROLE: "1"
		};
		var result = {};
		async.parallel([

			function(cb) {
				hdbext.loadProcedure(client, null, "get_po_header_data", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_TOP_3_EMP_PO_COMBINED_CNT = results;
						cb();
					});
				});

			},
			function(cb) {
				//(client, Schema, Procedure, callback)            		
				hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_BP_ADDRESSES = results;
						cb();
					});
				});
			}
		], (err) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				res.type("application/json").status(200).send(JSON.stringify(result));
			}
		});
	});
