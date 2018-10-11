/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/odataTest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.odataTest.controller.App", {

		onInit: function() {

			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");

			var urlMulti = "/xsodata/purchaseOrders.xsodata";
			this.getOwnerComponent().getModel().setProperty("/mPath", urlMulti);
			this.getOwnerComponent().getModel().setProperty("/mEntity1", "POHeader");
			this.getOwnerComponent().getModel().setProperty("/mEntity2", "POItem");
			
		},
		callMultiService: function() {
			var oTable = this.getView().byId("tblPOHeader");
			var oTableItem = this.getView().byId("tblPOItem");

			var mPath = this.getOwnerComponent().getModel().getProperty("/mPath");
			var mEntity1 = this.getOwnerComponent().getModel().getProperty("/mEntity1");
			var mEntity2 = this.getOwnerComponent().getModel().getProperty("/mEntity2");

			var oParams = {};
			oParams.json = true;
			oParams.useBatch = true;
			var oModel = new sap.ui.model.odata.v2.ODataModel(mPath, oParams);
			oModel.attachEvent("requestFailed", oDataFailed);

			function fnLoadMetadata() {
				oTable.setModel(oModel);
				oTable.setEntitySet(mEntity1);
				oTableItem.setModel(oModel);
				oTableItem.setEntitySet(mEntity2);				
				var oMeta = oModel.getServiceMetadata();
				var headerFields = "";
				var itemFields = "";
				for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
					var property = oMeta.dataServices.schema[0].entityType[0].property[i];
					headerFields +=  property.name + ",";
				}
				
				for (var i = 0; i < oMeta.dataServices.schema[0].entityType[1].property.length; i++) {
						var property = oMeta.dataServices.schema[0].entityType[1].property[i];
						itemFields +=  property.name + ",";
				}
				oTable.setInitiallyVisibleFields(headerFields);
				oTableItem.setInitiallyVisibleFields(itemFields);
			}
			
			oModel.attachMetadataLoaded(oModel, function() {
				fnLoadMetadata();
			});
			
			oModel.attachMetadataFailed(oModel, function() {
				sap.m.MessageBox.show("Bad Service Definition", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Service Call Error",
					actions: [sap.m.MessageBox.Action.OK],
					styleClass: "sapUiSizeCompact"
				});
			});
		},
		callExcel: function(oEvent) {
			//Excel Download
			window.open("/node/excel/download/");
			return;
		}
	});
});