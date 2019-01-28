/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
/*eslint-env es6 */
function onErrorCall(jqXHR, textStatus, errorThrown) {
	sap.ui.require(["sap/ui/core/Core", "sap/m/MessageBox"], function (Core, MessageBox) {
		if (typeof jqXHR.status === "undefined") {
			var errorRes = JSON.parse(jqXHR.response.body);
			MessageBox.show(
				errorRes.error.innererror.errordetail.DETAIL, {
					icon: MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
		} else {
			if (jqXHR.status === 500 || jqXHR.status === 400) {
				MessageBox.show(jqXHR.responseText, {
					icon: MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
				return;
			} else {
				MessageBox.show(jqXHR.statusText, {
					icon: MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
				return;
			}
		}
	});
}

function onODataError(oError) {
	sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
		if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
			var errorRes = JSON.parse(oError.responseText);
			if (!errorRes.error.innererror) {
				MessageBox.alert(errorRes.error.message.value);
			} else {
				if (!errorRes.error.innererror.message) {
					MessageBox.alert(errorRes.error.innererror.toString());
				} else {
					MessageBox.alert(errorRes.error.innererror.message);
				}
			}
			return;
		} else {
			MessageBox.alert(oError.response.statusText);
			return;
		}
	});
}

function oDataFailed(oControlEvent) {
	sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
		MessageBox.show("Bad Entity Definition", {
			icon: MessageBox.Icon.ERROR,
			title: "OData Service Call Error",
			actions: [MessageBox.Action.OK],
			styleClass: "sapUiSizeCompact"
		});
	});

	return;
}