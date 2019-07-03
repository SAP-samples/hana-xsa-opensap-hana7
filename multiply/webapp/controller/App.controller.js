/*eslint-env es6 */
"use strict";
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel"
	],
	function (Controller, Model) {

		return Controller.extend("sap.openSAP.multiply.controller.App", {

			onInit: function () {
				let model = new Model({});
				this.getView().setModel(model);
			},

			onLiveChange: function (oEvent) {
				let view = this.getView();
				let result = view.getModel().getData();
				let controller = this.getView().getController();
				let valSend;
				if (oEvent.getParameters().id.includes("val1")) {
					valSend = result.val2;
				} else {
					valSend = result.val1;
				}
				if (valSend === undefined) {
					valSend = 0;
				}
				let aUrl = "/sap/hana/democontent/epm/services/multiply.xsjs?cmd=multiply" +
					"&num1=" + escape(oEvent.getParameters().newValue) +
					"&num2=" + escape(valSend);
				jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					success: (myTxt) => {
						controller.onCompleteMultiply(myTxt, view);
					},
					error: controller.onErrorCall
				});
			},

			onCompleteMultiply: function (myTxt, view) {
				var oResult = view.byId("result");
				if (myTxt === undefined) {
					oResult.setText(0);
				} else {
					sap.ui.require(["sap/ui/core/format/NumberFormat"], (NumberFormat) => {
						var oNumberFormat = NumberFormat.getIntegerInstance({
							maxFractionDigits: 12,
							minFractionDigits: 0,
							groupingEnabled: true
						});
						oResult.setText(oNumberFormat.format(myTxt));
					});
				}
			},

			onErrorCall: function (oError) {
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
						MessageBox.alert(oError.statusText);
						return;
					}
				});
			}
			
		});
	});