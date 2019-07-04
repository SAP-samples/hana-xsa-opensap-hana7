/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/openSAP/odataBasicMeta/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});