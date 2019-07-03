/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
/*eslint-env es6 */
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/odataBasic/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.odataBasic.controller.App", {

		logout: function () {
			window.location.href = "../my/logout";
		},

		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			try {
				var aUrl = "../node/getSessionInfo";
				var userData = jQuery.ajax({
					url: aUrl,
					method: "GET",
					dataType: "json",
					async: false
				}).responseJSON;
				var initials = userData.session[0].givenName[0] + userData.session[0].familyName[0];
				var config = this.getOwnerComponent().getModel("config");
				config.setProperty("/UserName", initials);
				config.setProperty("/fullName", userData.session[0].givenName + userData.session[0].familyName);
				config.setProperty("/givenName", userData.session[0].givenName);
				config.setProperty("/familyName", userData.session[0].familyName);
				config.setProperty("/locale", userData.session[0].Language);
				config.setProperty("/email", userData.session[0].emails[0].value);

			} catch (exp) {
				/* Do nothing, wrapping with try/catch so that if for some reason copilot resources doesn't load
				   this will atleast let the user use the rest of the application gracefully. */
			}

			var userModel = this.getOwnerComponent().getModel("userModel");
			var oTable = this.getView().byId("userTable");
			oTable.setModel(userModel);

		},

		callUserService: function () {
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
			mParams.success = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Create successful");
				});
			};
			mParams.error = onODataError;
			oModel.create("/Users", oEntry, mParams);
		},

		callUserUpdate: function () {
			var oModel = this.getOwnerComponent().getModel("userModel");
			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});

			var mParams = {};
			mParams.error = onODataError;
			mParams.success = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Update successful");
				});
			};

			oModel.submitChanges(mParams);
		},

		onAvatar: function (oEvent) {
			this.createPopover();
			this._oQuickView.setModel(this.getOwnerComponent().getModel("config"));
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
				this._oQuickView.openBy(oButton);
			});
		},

		createPopover: function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}

			this._oQuickView = sap.ui.xmlfragment("opensap.odataBasic.view.QuickView", this);
			this.getView().addDependent(this._oQuickView);
		},

		onExit: function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		},

		onBatchDialogPress: function () {
			var view = this.getView();
			view._bDialog = sap.ui.xmlfragment(
				"opensap.odataBasic.view.batchDialog", this // associate controller with the fragment
			);
			view._bDialog.addStyleClass("sapUiSizeCompact");
			view.addDependent(this._bDialog);
			view._bDialog.addContent(view.getController().getItem(true));
			view._bDialog.open();
		},

		onDialogCloseButton: function () {
			this.getView()._bDialog.close();
		},

		getItem: function (isFirstRow) {
			var view = this.getView();
			var addIcon = new sap.ui.core.Icon({
				src: "sap-icon://add",
				color: "#006400",
				size: "1.5rem",
				press: function () {
					view._bDialog.addContent(view.getController().getItem(false));
				}
			});

			var deleteIcon = new sap.ui.core.Icon({
				src: "sap-icon://delete",
				color: "#49311c",
				size: "1.5rem",
				press: function (oEvent) {
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

		onSubmitBatch: function () {
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

			var batchModel = new sap.ui.model.odata.v2.ODataModel("../xsodata/user.xsodata/", oParams);
			//var batchChanges = [];
			var mParams = {};
			mParams.groupId = "1001";
			mParams.success = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Create successful");
				});
			};
			mParams.error = onODataError;

			for (var k = 0; k < newUserList.length; k++) {
				batchModel.create("/Users", newUserList[k], mParams);
			}

		}

	});
});