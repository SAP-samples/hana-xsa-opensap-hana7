/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.xs.exerciseAsync.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			jQuery.sap.require("sap.m.MessageBox");
			jQuery.sap.require("sap.m.MessageToast");

			sap.ui.core.UIComponent.prototype.init.apply(
				this, arguments);

			// Chat Model
			var oModel = this.getModel("chatModel");
			oModel.setData({
				chat: "",
				message: ""
			});
		},

		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}

	});

});