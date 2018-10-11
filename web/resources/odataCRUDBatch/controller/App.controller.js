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
			if (oError.statusCode === 500 || oError.statusCode === 400 || oError.statusCode === "500" || oError.statusCode === "400" ) {
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

		},

		onBatchDialogPress: function() {
			var view = this.getView();
			view._bDialog = sap.ui.xmlfragment(
				"opensap.odataBasic.view.batchDialog", this // associate controller with the fragment
			);
			view._bDialog.addStyleClass("sapUiSizeCompact");
			view.addDependent(this._bDialog);
			view._bDialog.addContent(view.getController().getItem(true));
			view._bDialog.open();
		},

		onDialogCloseButton: function() {
			this.getView()._bDialog.close();
		},

		getItem: function(isFirstRow) {
			var view = this.getView();
			var addIcon = new sap.ui.core.Icon({
				src: "sap-icon://add",
				color: "#006400",
				size: "1.5rem",
				press: function() {
					view._bDialog.addContent(view.getController().getItem(false));
				}
			});

			var deleteIcon = new sap.ui.core.Icon({
				src: "sap-icon://delete",
				color: "#49311c",
				size: "1.5rem",
				press: function(oEvent) {
					view._bDialog.removeContent(oEvent.oSource.oParent.sId);
				}
			});

			var icon;
			if (isFirstRow) {
				icon = addIcon;
			} else {
				icon = deleteIcon;
			}
			icon.addStyleClass("iconPadding");

			var firstNameTxt = new sap.m.Label({
				text: "First Name"
			});
			firstNameTxt.addStyleClass("alignText");
			var firstNameInput = new sap.m.Input({});

			var lastNameTxt = new sap.m.Label({
				text: "Last Name"
			});
			lastNameTxt.addStyleClass("alignText");
			var lastNameInput = new sap.m.Input({});

			var emailTxt = new sap.m.Label({
				text: "Email"
			});
			emailTxt.addStyleClass("alignText");
			var emailInput = new sap.m.Input({});

			return new sap.m.FlexBox({
				// enableFlexBox: true,
				//    fitContainer: true,
				//  justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				items: [firstNameTxt,
					firstNameInput,
					lastNameTxt,
					lastNameInput,
					emailTxt,
					emailInput,
					icon
				]
			});
		},

		onSubmitBatch: function() {
			var view = this.getView();
			var content = view._bDialog.getContent();
			var newUserList = [];
			for (var i = 0; i < content.length; i++) {
				var user = {};
				user.UserId = "0000000000";
				user.FirstName = content[i].getItems()[1].getValue();
				user.LastName = content[i].getItems()[3].getValue();
				user.Email = content[i].getItems()[5].getValue();
			//	user.ZMYNEW1 = "";
				newUserList.push(user);
			}

			//create an array of batch changes and save  
			var oParams = {};
			oParams.json = true;
			oParams.defaultUpdateMethod = "PUT";
			oParams.useBatch = true;

			var batchModel = new sap.ui.model.odata.v2.ODataModel("/user/xsodata/userBeforeExit.xsodata/", oParams);
			//var batchChanges = [];
			var mParams = {};
			mParams.groupId = "1001";
			mParams.success = function() {
				sap.m.MessageToast.show("Create successful");
			};
			mParams.error = this.onErrorCall;

			for (var k = 0; k < newUserList.length; k++) {
				batchModel.create("/Users", newUserList[k], mParams);
			}

		}

	});
});