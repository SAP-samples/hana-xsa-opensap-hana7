/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, yoda: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/shineNext/partners/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.shineNext.partners.controller.Input", {

		onInit: function() {

			// set model
			var model = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(model);
		},

		getResultItem: function() {
			var result = this.getView().getModel().getData();
			if (!result.Id) {
				result.Id = '0000000000';
			}
			return result;
		},

		setResultItem: function(existingItem) {
			var data = (existingItem === undefined) ? {} : existingItem;
			this.getView().getModel().setData(data);
		}
	});
});