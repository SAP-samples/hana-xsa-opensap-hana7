sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter"
], function (Controller, Sorter) {
	"use strict";

	var MainController = Controller.extend("opensap.poListV4.controller.Main", {

		logout: function () {
			window.location.href = "/my/logout";
		},
		onInit: function () {
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
		},

		onSort: function (oEvent) {
			var oBinding = this.byId("entitySets").getBinding("items");

			oBinding.sort(new Sorter("@sapui.name", oEvent.getSource().getPressed()));
		}

	});

	return MainController;
});