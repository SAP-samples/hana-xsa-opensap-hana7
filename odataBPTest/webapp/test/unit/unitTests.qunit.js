/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/openSAP/odataBPTest/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});