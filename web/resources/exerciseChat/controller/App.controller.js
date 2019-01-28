/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
/*eslint-env es6 */
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/xs/chat/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ws/WebSocket"
], function (BaseController, JSONModel, WebSocket) {
	"use strict";
	var connection = new WebSocket("/node/chatServer");
	return BaseController.extend("sap.xs.chat.controller.App", {

		onInit: function () {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode

			// server messages
			connection.attachMessage(function (oControlEvent) {
				var eventData = oControlEvent.getParameter("data");
				sap.ui.require(["sap/ui/core/Core"], function (Core) {
					var oModel = Core.getComponent("comp").getModel("chatModel");
					var result = oModel.getData();

					var data = jQuery.parseJSON(eventData);
					var msg = data.user + ": " + data.text,
						lastInfo = result.chat;

					if (lastInfo.length > 0) {
						lastInfo += "\r\n";
					}
					oModel.setData({
						chat: lastInfo + msg
					}, true);

					Core.byId("comp---app--message").onsapenter = function (e) {
						if (sap.m.InputBase.prototype.onsapenter) {
							sap.m.InputBase.prototype.onsapenter.apply(this, arguments);
						}
						var oController = Core.byId("comp---app").getController();
						oController.sendMsg();
					};
				});

			});

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
		sendMsg: function () {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			var result = oModel.getData();
			var msg = result.message;
			if (msg.length > 0) {
				connection.send(JSON.stringify({
					user: result.user,
					text: result.message
				}));
				oModel.setData({
					message: ""
				}, true);
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
					MessageBox.alert(oError.response.statusText);
					return;
				}
			});
		}
	});
});