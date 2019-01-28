/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
/*eslint-env es6 */
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/odataBasic/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.odataBasic.controller.App", {

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");
			var userModel = this.getOwnerComponent().getModel("userModel");
			var oTable = this.getView().byId("userTable");
			oTable.setModel(userModel);
		},

		onDataEvents: function (data, error) {
			if (error) {
				onODataError(error);
			}
		},

		callUserService: function () {

			try {
				var oModel = this.getOwnerComponent().getModel("userModel");
				var result = this.getView().getModel().getData();
				var oList = this.byId("userTable").getTable(),
					oBinding = oList.getBinding("items"),
					// Create a new entry through the table's list binding
					oContext = oBinding.create({
						"USERID": 0,
						"FIRSTNAME": result.FirstName,
						"LASTNAME": result.LastName,
						"EMAIL": result.Email
					});

				// Note: this promise fails only if the transient entity is deleted
				oContext.created().then(function () {
					sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
						MessageBox.alert("User created: " + oContext.getProperty("USERID"));
					});
				}, function (oError) {
					console.log(oError.toString());
					onODataError(error);
				});
			} catch (err) {
				sap.ui.require(["sap/m/MessageBox"], (MessageBox) => {
					MessageBox.alert(err.toString());
				});
			}
		},

		callUserUpdate: function () {
			var oModel = this.getOwnerComponent().getModel("userModel");

			var mParams = {};
			mParams.error = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Update failed");
				});
			};
			mParams.success = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Update Successful");
				});
			};

			oModel.submitChanges(mParams);
		}
	});
});