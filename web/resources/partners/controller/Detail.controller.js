/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, yoda: 0*/
jQuery.sap.require("sap.m.MessageToast");
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/shineNext/partners/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.shineNext.partners.controller.Detail", {

		onInit: function() {
			// subscribe to onBeforeShow events
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},

		onBeforeShow: function(evt) {
			if (evt.data.context) {
				this.getView().setBindingContext(evt.data.context);
			}
		},

		navButtonPress: function(evt) {
			sap.ui.getCore().getEventBus().publish("nav", "back");
		}
	});
});