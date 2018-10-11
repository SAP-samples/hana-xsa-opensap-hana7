/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
function onErrorCall(jqXHR, textStatus, errorThrown) {
	var page = sap.ui.getCore().byId("pageID");
	page.setBusy(false);
	if (typeof jqXHR.status === "undefined") {
		var errorRes = JSON.parse(jqXHR.response.body);
		sap.m.MessageBox.show(
			errorRes.error.innererror.errordetail.DETAIL, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Service Call Error",
				actions: [sap.m.MessageBox.Action.OK],
				styleClass: "sapUiSizeCompact"
			});
	} else {
		if (jqXHR.status === 500 || jqXHR.status === 400) {
			sap.m.MessageBox.show(jqXHR.responseText, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Service Call Error",
				actions: [sap.m.MessageBox.Action.OK],
				styleClass: "sapUiSizeCompact"
			});
			return;
		} else {
			sap.m.MessageBox.show(jqXHR.statusText, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: "Service Call Error",
				actions: [sap.m.MessageBox.Action.OK],
				styleClass: "sapUiSizeCompact"
			});
			return;
		}
	}
}

function oDataFailed(oControlEvent) {
	sap.m.MessageBox.show("Bad Entity Definition", {
		icon: sap.m.MessageBox.Icon.ERROR,
		title: "OData Service Call Error",
		actions: [sap.m.MessageBox.Action.OK],
		styleClass: "sapUiSizeCompact"
	});
	return;
}