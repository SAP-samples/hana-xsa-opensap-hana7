/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-shadow:0, sap-no-location-usage:0 */
/*eslint-env es6 */
sap.ui.require(["sap/ui/core/Core", "sap/ui/core/Component"], (oCore, Component) => {

	function onLoadSession(myJSON) {
		try {
			var result = JSON.parse(myJSON);
			if (result.session.length > 0) {
				if (result.session[0].familyName !== "") {
					return result.session[0].givenName + " " + result.session[0].familyName;
				} else {
					return result.session[0].UserName;
				}
			}
		} catch (e) {
			return "";
		}
		return "";
	}

	function getSessionInfo() {
		var aUrl = "../node/getSessionInfo";

		return onLoadSession(
			jQuery.ajax({
				url: aUrl,
				method: "GET",
				dataType: "json",
				async: false
			}).responseText);
	}

	Component.create({
		id: "comp",
		name: "root",
		manifestFirst: true,
		async: true
	}).then((oComp) => {
		sap.ui.require(["sap/ui/core/ComponentContainer"], (ComponentContainer) => {
			let oCont = new ComponentContainer({
				component: oComp,
				height: "100%"
			});

			let username = getSessionInfo();
			oCore.loadLibrary("sap.ui.unified", {
				async: true
			}).then(() => {
				let oShell = new sap.ui.unified.Shell({
					id: "myShell",
					icon: "../images/sap_18.png",
					headEndItems: new sap.ui.unified.ShellHeadItem({
						icon: "sap-icon://log",
						tooltip: "Logoff",
						press: () => {
							window.location.href = "../my/logout";
						}
					}),
					user: new sap.ui.unified.ShellHeadUserItem({
						image: "sap-icon://person-placeholder",
						username: username
					}),
					content: oCont
				}).placeAt("content");
			});
		});
	});

});