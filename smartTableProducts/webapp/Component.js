/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0*/
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/generic/app/AppComponent"
], function(UIComponent, AppComponent) {
	"use strict";

	return UIComponent.extend("sap.openSAP.smartTableProducts.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			
			sap.ui.getCore().loadLibrary("sap.ui.generic.app", { async: true});
			
			sap.ui.core.UIComponent.prototype.init.apply(
				this, arguments);
		},

		destroy: function() {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});