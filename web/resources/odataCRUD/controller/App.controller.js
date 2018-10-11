/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/odataBasic/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.odataBasic.controller.App", {

		onInit: function() {
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");
			var userModel = this.getOwnerComponent().getModel("userModel");
			var oTable = this.getView().byId("userTable");
			oTable.setModel(userModel);
		},

		callUserService: function() {
			var oModel = this.getOwnerComponent().getModel("userModel");
			var result = this.getView().getModel().getData();
			var oEntry = {};
			oEntry.UserId = "0000000000";
			oEntry.FirstName = result.FirstName;
			oEntry.LastName = result.LastName;
			oEntry.Email = result.Email;

			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});
			var mParams = {};
			mParams.success = function() {
				sap.m.MessageToast.show("Create successful");
			};
			mParams.error = this.onErrorCall;
			oModel.create("/Users", oEntry, mParams);
		},

		callUserUpdate: function() {
			var oModel = this.getOwnerComponent().getModel("userModel");
			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});

			var mParams = {};
			mParams.error = function() {
				sap.m.MessageToast.show("Update failed");
			};
			mParams.success = function() {
				sap.m.MessageToast.show("Update successful");
			};

			oModel.submitChanges(mParams);
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