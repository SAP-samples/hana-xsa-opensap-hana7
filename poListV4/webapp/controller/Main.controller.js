sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter"
], function (Controller, Sorter) {
	"use strict";

	var MainController = Controller.extend("sap.openSAP.poListV4.controller.Main", {

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
		},

		onSort: function (oEvent) {
			var oBinding = this.byId("entitySets").getBinding("items");

			oBinding.sort(new Sorter("@sapui.name", oEvent.getSource().getPressed()));
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

			this._oQuickView = sap.ui.xmlfragment("sap.openSAP.poListV4.view.QuickView", this);
			this.getView().addDependent(this._oQuickView);
		},

		onExit: function () {
			if (this._oQuickView) {
				this._oQuickView.destroy();
			}
		}		

	});

	return MainController;
});