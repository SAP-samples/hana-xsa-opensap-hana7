sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/m/HBox",
	"sap/ui/core/mvc/View", // sap.ui.view()
	"sap/ui/core/mvc/ViewType",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/test/TestUtils"
//	"sap/ui/thirdparty/sinon"
], function (UIComponent, Device, HBox, View, ViewType, JSONModel, ODataModel, TestUtils) {
	"use strict";

	return UIComponent.extend("opensap.poListV4.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			jQuery.sap.require("sap.m.MessageBox");
			jQuery.sap.require("sap.m.MessageToast");

			sap.ui.core.UIComponent.prototype.init.apply(
				this, arguments);
		},

		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		createContent: function () {
			var bHasOwnProxy = false, //= this.proxy !== false,
				oLayout = new HBox({
					renderType: "Bare"
				}),
				oMetaModel,
				oModel = this.getModel(),
				fnProxy = bHasOwnProxy ? this.proxy : TestUtils.proxy,
				bRealOData = TestUtils.isRealOData(),
				sServiceUrl = fnProxy(oModel.sServiceUrl);

			if (oModel.sServiceUrl !== sServiceUrl) {
				//replace model from manifest in case of proxy
				oMetaModel = oModel.getMetaModel();
				oModel.destroy();
				oModel = new ODataModel({
					annotationURI: oMetaModel.aAnnotationUris,
					serviceUrl: sServiceUrl,
					synchronizationMode: "None"
				});
				this.setModel(oModel);
			}
			oMetaModel = oModel.getMetaModel();
			oMetaModel.setDefaultBindingMode("OneWay");

			View.create({
				async: true,
				bindingContexts: {
					undefined: oModel.createBindingContext("/POItemsView")
				},
				models: {
					// Note: XML Templating creates bindings to default model only!
					undefined: oModel,
					metaModel: oMetaModel,
					ui: new JSONModel({
						bRealOData: bRealOData,
						icon: bRealOData ? "sap-icon://building" : "sap-icon://record",
						iconTooltip: bRealOData ? "real OData service" : "mock OData service"
					})
				},
				preprocessors: {
					xml: {
						bindingContexts: {
							data: oModel.createBindingContext("/POItemsView")
						},
						models: {
							data: oModel,
							meta: oMetaModel
						}
					}
				},
				type: ViewType.XML,
				viewName: "opensap.poListV4.view.Main"
			}).then(function (oView) {
				oLayout.addItem(oView);
			});

			return oLayout;
		}
	});
});