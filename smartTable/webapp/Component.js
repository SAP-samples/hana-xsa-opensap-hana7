sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/openSAP/smartTable/model/models",
	"sap/ui/generic/app/AppComponent"
], function (UIComponent, Device, models, AppComponent) {
	"use strict";

	return UIComponent.extend("sap.openSAP.smartTable.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
				
			sap.ui.getCore().loadLibrary("sap.ui.generic.app", { async: true});
		
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});