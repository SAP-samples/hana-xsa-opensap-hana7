/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, yoda: 0, quotes: 0*/
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/shineNext/partners/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.shineNext.partners.controller.Home", {

		onInit: function() {
			var model = new sap.ui.model.json.JSONModel({
				mode: sap.m.ListMode.None,
				inEdit: false,
				inDelete: false,
				inBatch: false
			});
			this.getView().setModel(model, "local");
		},

		itemPress: function(evt) {
			var bus = sap.ui.getCore().getEventBus();
			bus.publish("nav", "to", {
				id: "Detail",
				data: {
					context: evt.getSource().getBindingContext()
				}
			});
		},

		createButtonPress: function(evt) {
			var view = this.getView();
			view.inputCreate.getController().setResultItem(undefined);
			sap.ui.getCore().getEventBus().publish("nav", "virtual");
			view.createDialog.open();
		},

		createDialogCancel: function(evt) {
			var view = this.getView();
			view.createDialog.close();
			sap.ui.getCore().getEventBus().publish("nav", "back");
		},

		createDialogConfirm: function() {
			var view = this.getView();

			// update model
			var newItem = view.inputCreate.getController().getResultItem();
			var oModel = view.inputCreate.getController().getOwnerComponent().getModel("bpModel");

			var mParams = {};
			mParams.success = function() {
				//	var view = this.getView();
				view.createDialog.close();
				sap.ui.getCore().getEventBus().publish("nav", "back");
				sap.m.MessageToast.show("Create successful");
			};
			mParams.error = this.onErrorCall;

			oModel.create("/Buyer", newItem, mParams);

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
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
			}
		}
	});
});