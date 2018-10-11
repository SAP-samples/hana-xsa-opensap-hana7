/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"opensap/odataTest/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("opensap.odataTest.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			jQuery.sap.require("sap.m.MessageBox");
			jQuery.sap.require("sap.m.MessageToast");
			this.setModel(models.createDeviceModel(), "device");

			sap.ui.core.UIComponent.prototype.init.apply(
				this, arguments);
		},

		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});

});