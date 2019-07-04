/*global QUnit*/

sap.ui.define([
	"sap/openSAP/smartTable/controller/SmartTable.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SmartTable Controller");

	QUnit.test("I should test the SmartTable controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});