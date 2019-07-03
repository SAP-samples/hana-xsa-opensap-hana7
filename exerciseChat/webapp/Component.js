sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/xs/exerciseChat/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("sap.xs.exerciseChat.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Chat Model
			var oModel = this.getModel("chatModel");
			var names = ["Student1", "Student2", "Student3", "Student4", "Student5", "Student6"];
			oModel.setData({
				user: names[Math.floor(names.length * Math.random())],
				chat: "",
				message: ""
			});
		}
	});
});