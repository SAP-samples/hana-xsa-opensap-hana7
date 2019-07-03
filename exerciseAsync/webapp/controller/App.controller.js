/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
/*eslint-env es6 */
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/xs/exerciseAsync/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ws/WebSocket"
], function (BaseController, JSONModel, WebSocket) {
	"use strict";
	var connection = new WebSocket("/node/excAsync");

	return BaseController.extend("sap.xs.exerciseAsync.controller.App", {

		onInit: function () {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode

			// connection opened 
			connection.attachOpen(function (oControlEvent) {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("connection opened");
				});
			});

			// server messages
			connection.attachMessage(function (oControlEvent) {
				var oModel = this.getModel("chatModel");
				var eventData = oControlEvent.getParameter("data");
				var result = oModel.getData();

				var data = jQuery.parseJSON(eventData);
				var msg = data.text,
					lastInfo = result.chat;

				if (lastInfo.length > 0) {
					lastInfo += "\r\n";
				}
				oModel.setData({
					chat: lastInfo + msg
				}, true);
			}, this);

			// error handling
			connection.attachError(function (oControlEvent) {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Websocket connection error");
				});
			});

			// onConnectionClose
			connection.attachClose(function (oControlEvent) {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Websocket connection closed");
				});
			});

		},

		// send message
		sendBasic: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "async"
			}));
		},
		sendFileS: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "fileSync"
			}));
		},

		sendFileA: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "fileAsync"
			}));
		},
		sendHTTP: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "httpClient"
			}));
		},
		sendDB1: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "dbAsync"
			}));
		},
		sendDB2: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "dbAsync2"
			}));
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
					MessageBox.alert(oError.response.statusText);
					return;
				}
			});
		}
	});
});