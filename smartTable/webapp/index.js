/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-shadow:0, sap-no-location-usage:0*/
/*eslint-env es6 */
sap.ui.require(["sap/ui/core/Core", "sap/ui/core/Component"], (oCore, Component) => {

	function onLoadSession(myJSON) {
		try {
			var result = JSON.parse(myJSON);
			if (result.session.length > 0) {
				if (result.session[0].familyName !== "") {
					return result.session[0].givenName[0] + result.session[0].familyName[0];
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
		var aUrl = "/node/getSessionInfo";

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
			oCore.loadLibrary("sap.f", {
				async: true
			}).then(() => {
				let oShell = new sap.f.ShellBar({
					id: "myShell",
					homeIcon: "./images/sap_18.png",
					showCopilot: true,
					showSearch: true,
					showNotifications: true,
					showProductSwitcher: true,
					profile: new sap.f.Avatar({
						initials: username
					})
				}).placeAt("content");
				oCont.placeAt("content");
			});
		});
	});

});