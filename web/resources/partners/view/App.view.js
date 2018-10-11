sap.ui.jsview("sap.shineNext.partners.view.App", {

	getControllerName: function () {
		return "sap.shineNext.partners.controller.App";
	},

	createContent : function (oController) {
		
		// to avoid scrollbars on desktop the root view must be set to block display
		this.setDisplayBlock(true);
		
		this.app = new sap.m.App({
			homeIcon : {
				'favicon' : '/images/favicon.ico',
				'precomposed': false
			}
		});
		
		this.app.addPage(new sap.ui.jsview("Home", "sap.shineNext.partners.view.Home"));
		
		return this.app;
	}
});