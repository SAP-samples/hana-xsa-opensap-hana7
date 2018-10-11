jQuery.sap.declare("sap.openSAP.smarttable.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");

sap.ui.core.UIComponent.extend("sap.openSAP.smarttable.Component", {
//  sap.ui.generic.app.AppComponent.extend("sap.openSAP.smarttable.Component", { 
	metadata: {
		manifest: "json",

		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp"
			]
		}
	}
});
