/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/xs/exerciseAsync/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	jQuery.sap.require("sap.ui.core.ws.WebSocket"); 
    var connection = new sap.ui.core.ws.WebSocket("/node/excAsync");
	return BaseController.extend("sap.xs.exerciseAsync.controller.App", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode

			// connection opened 
			connection.attachOpen(function(oControlEvent) {
				sap.m.MessageToast.show("connection opened");
			});

			// server messages
			connection.attachMessage(function(oControlEvent) {
				var oModel = sap.ui.getCore().getComponent("comp").getModel("chatModel");
				var result = oModel.getData();

				var data = jQuery.parseJSON(oControlEvent.getParameter("data"));
				var msg = data.text,
					lastInfo = result.chat;

				if (lastInfo.length > 0) {
					lastInfo += "\r\n";
				}
				oModel.setData({
					chat: lastInfo + msg
				}, true);

				// scroll to textarea bottom to show new messages
			//	$("#comp---app--chatInfo-inner").scrollTop($("#comp---app--chatInfo-inner")[0].scrollHeight);
			});

			// error handling
			connection.attachError(function(oControlEvent) {
				sap.m.MessageToast.show("Websocket connection error");
			});

			// onConnectionClose
			connection.attachClose(function(oControlEvent) {
				sap.m.MessageToast.show("Websocket connection closed");
			});

		},

		// send message
		sendBasic: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "async"
			}));
		},
		sendFileS: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "fileSync"
			}));
		},

		sendFileA: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "fileAsync"
			}));
		},
		sendHTTP: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "httpClient"
			}));
		},
		sendDB1: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "dbAsync"
			}));
		},
		sendDB2: function() {
			var oModel = this.getOwnerComponent().getModel("chatModel");
			oModel.setData({
				chat: ""
			}, true);
			connection.send(JSON.stringify({
				action: "dbAsync2"
			}));
		},
		onErrorCall: function(oError) {
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