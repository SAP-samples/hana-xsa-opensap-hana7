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
			//	var oConfig = this.getOwnerComponent().getModel("config");
			//	var userName = oConfig.getProperty("/UserName");

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

			var bpModel = this.getOwnerComponent().getModel("bpModel");
			var oTable = this.getView().byId("bpTable");
			//To-Do Bind Model to table
			/*			oTable.setModel(bpModel);
						oTable.setEntitySet("BusinessPartners");
						oTable.setInitiallyVisibleFields("PARTNERID,COMPANYNAME,PARTNERROLE");*/

			function fnLoadMetadata() {
				try {
					oTable.setModel(bpModel);
					oTable.setEntitySet("BusinessPartners");
					var oMeta = bpModel.getServiceMetadata();
					var headerFields = "";
					for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
						var property = oMeta.dataServices.schema[0].entityType[0].property[i];
						headerFields += property.name + ",";
					}
					oTable.setInitiallyVisibleFields(headerFields);
				} catch (e) {
					console.log(e.toString());
					oDataFailed();
				}
			}
			bpModel.attachMetadataLoaded(bpModel, function () {
				fnLoadMetadata();
			});
			fnLoadMetadata();

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
		}
	});
});