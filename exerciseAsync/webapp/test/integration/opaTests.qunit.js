/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/xs/exerciseAsync/exerciseAsync/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});