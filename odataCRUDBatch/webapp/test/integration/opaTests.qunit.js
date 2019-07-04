/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/openSAP/odataCRUDBatch/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});