/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/HBox",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"opensap/odataBasic/model/models"
], function (UIComponent, Device, HBox, View, ViewType, models) {
	"use strict";

	return UIComponent.extend("opensap.odataBasic.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

	});
});