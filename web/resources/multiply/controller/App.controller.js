sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";

	return Controller.extend("sap.shineNext.xsjsMultiply.controller.App", {

		onInit: function () {
			var model = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(model);
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
		},
		onLiveChange: function (oEvent) {
			var view = this.getView();
			var result = view.getModel().getData();
			var controller = this.getView().getController();
			var valSend;
			if (oEvent.getParameters().id === "comp---app--val1") {
				valSend = result.val2;
			} else {
				valSend = result.val1;
			}
			if (valSend === undefined) {
				valSend = 0;
			}
			var aUrl = "/sap/hana/democontent/epm/services/multiply.xsjs?cmd=multiply" +
				"&num1=" + escape(oEvent.getParameters().newValue) +
				"&num2=" + escape(valSend);
			jQuery.ajax({
				url: aUrl,
				method: "GET",
				dataType: "json",
				success: controller.onCompleteMultiply,
				error: controller.onErrorCall
			});
		},
		onCompleteMultiply: function (myTxt) {
			var oResult = sap.ui.getCore().byId("comp---app--result");
			if (myTxt === undefined) {
				oResult.setText(0);
			} else {
				jQuery.sap.require("sap.ui.core.format.NumberFormat");
				var oNumberFormat = sap.ui.core.format.NumberFormat.getIntegerInstance({
					maxFractionDigits: 12,
					minFractionDigits: 0,
					groupingEnabled: true
				});
				oResult.setText(oNumberFormat.format(myTxt));
			}
		},

		onErrorCall: function (oError) {
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}

		}
	});
});