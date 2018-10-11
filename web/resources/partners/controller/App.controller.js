/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, yoda: 0*/
jQuery.sap.require("sap.m.InstanceManager");
jQuery.sap.require("jquery.sap.history");
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"sap/shineNext/partners/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.shineNext.partners.controller.App", {

		getDefaultPage: function() {
			return "Home";
		},

		onInit: function() {
			this.getView().setModel(this.getOwnerComponent().getModel("bpModel"));
			var historyDefaultHandler = function(navType) {
				if (navType === jQuery.sap.history.NavType.Back) {
					this.navBack(this.getDefaultPage());
				} else {
					this.navTo(this.getDefaultPage(), null, false);
				}
			};

			var historyPageHandler = function(params, navType) {
				if (!params || !params.id) {
					jQuery.sap.log.error("invalid parameter: " + params);
				} else {
					if (navType === jQuery.sap.history.NavType.Back) {
						this.navBack(params.id);
					} else {
						this.navTo(params.id, params.data, false);
					}
				}
			};

			jQuery.sap.history({
				routes: [{
					// This handler is executed when you navigate back to the history state on the path "page"
					path: "page",
					handler: jQuery.proxy(historyPageHandler, this)
				}],
				// The default handler is executed when you navigate back to the history state with an empty hash
				defaultHandler: jQuery.proxy(historyDefaultHandler, this)
			});

			// subscribe to event bus
			var bus = sap.ui.getCore().getEventBus();
			bus.subscribe("nav", "to", this.navHandler, this);
			bus.subscribe("nav", "back", this.navHandler, this);
			bus.subscribe("nav", "virtual", this.navHandler, this);
		},

		navHandler: function(channelId, eventId, data) {
			if (eventId === "to") {
				if (!data.id) {
					jQuery.sap.log.error("'nav to' event cannot be processed. data.id must be given");
				}
				this.navTo(data.id, data.data, true);
			} else if (eventId === "back") {
				if (!data.step) {
					data.step = 1;
				}
				if (data.home) {
					jQuery.sap.history.backToHash("");
				} else if (data.step > 0) {
					jQuery.sap.history.back(data.step);
				} else {
					jQuery.sap.log.error(
						"'nav back' event cannot be processed. At least one from [data.step, data.home] must be given with valid value");
				}
			} else if (eventId === "virtual") {
				jQuery.sap.history.addVirtualHistory();
			} else {
				jQuery.sap.log.error("'nav' event cannot be processed. There's no handler registered for event with id: " + eventId);
			}
		},

		navTo: function(id, data, writeHistory) {

			if (id === undefined) {

				// invalid id
				jQuery.sap.log.error("navTo failed due to missing id");

			} else {

				// Closing popovers needs to be done in navTo and navBack
				if (sap.m.InstanceManager.hasOpenPopover()) {
					sap.m.InstanceManager.closeAllPopovers();
					jQuery.sap.log.info("navTo - closed popover(s)");
				}

				// load view on demand
				var app = this.getView().app;
				if (app.getPage(id) === null) {
					var type = ("Home" === id) ? "JS" : "XML";
					var page = sap.ui.view({
						id: id,
						viewName: "sap.shineNext.partners.view." + id,
						type: type
					});
					app.addPage(page);
					jQuery.sap.log.info("app controller > loaded page: " + id);
				}

				// navigate in the app control
				var transition = ("Update" === id) ? "show" : "slide";
				app.to(id, transition, data);

				// write browser history
				if (writeHistory === undefined || writeHistory) {
					var bookmarkable = false;
					var stateData = {
						id: id
					};
					jQuery.sap.history.addHistory("page", stateData, bookmarkable);
				}

				// log
				jQuery.sap.log.info("navTo - to page: " + id);
			}
		},

		navBack: function(id) {

			if (!id) {

				// invalid parameter
				jQuery.sap.log.error("navBack - parameters id must be given");

			} else {

				// close open dialogs 
				if (sap.m.InstanceManager.hasOpenDialog()) {
					sap.m.InstanceManager.closeAllDialogs();
					jQuery.sap.log.info("navBack - closed dialog(s)");
				}

				// close open popovers
				if (sap.m.InstanceManager.hasOpenPopover()) {
					sap.m.InstanceManager.closeAllPopovers();
					jQuery.sap.log.info("navBack - closed popover(s)");
				}

				// ... and navigate back
				var app = this.getView().app;
				var currentId = (app.getCurrentPage()) ? app.getCurrentPage().getId() : null;
				if (currentId !== id) {
					app.backToPage(id);
					jQuery.sap.log.info("navBack - back to page: " + id);
				}
			}
		}
	});
});