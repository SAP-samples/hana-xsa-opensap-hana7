	app.get("/userinfo", function(req, res) {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		let accessToken;
		let authWriteScope = false;
		let authReadScope = false;
		let controllerAdminScope = true;
		let userInfo = {
			"name": req.user.id,
			"familyName": req.user.name.familyName,
			"emails": req.user.emails,
			"scopes": [],
			"identity-zone": req.authInfo.identityZone
		};
		function getAccessToken(req) {
			var accessToken = null;
			if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
				accessToken = req.headers.authorization.split(" ")[1];
			}
			return accessToken;
		}
		accessToken = getAccessToken(req);
		let uaa = xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa;
		xssec.createSecurityContext(accessToken, uaa, function(error, securityContext) {
			if (error) {
				console.log("Security Context creation failed");
				return;
			}
			console.log("Security Context created successfully");
			userInfo.scopes = securityContext.scopes;
			console.log("Scope checked successfully");
		});
		return res.type("application/json").status(200).json(userInfo);
	});
