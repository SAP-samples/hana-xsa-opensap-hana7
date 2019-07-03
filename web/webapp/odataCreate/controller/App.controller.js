/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0*/
/*eslint-env es6 */
//To use a javascript controller its name must end with .controller.js
sap.ui.define([
	"opensap/odataTest/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("opensap.odataTest.controller.App", {

		onInit: function () {

			var oConfig = this.getOwnerComponent().getModel("config");
			var userName = oConfig.getProperty("/UserName");

			var urlMulti = "/xsodata/poCreate.xsodata";
			this.getOwnerComponent().getModel().setProperty("/mPath", urlMulti);
			this.getOwnerComponent().getModel().setProperty("/mEntity1", "purchaseDetails");

		},
		callService: function () {
			var oTable = this.getView().byId("tblPOHeader");

			var mPath = this.getOwnerComponent().getModel().getProperty("/mPath");
			var mEntity1 = this.getOwnerComponent().getModel().getProperty("/mEntity1");

			var oParams = {};
			oParams.json = true;
			oParams.useBatch = false;
			var oModel = new sap.ui.model.odata.v2.ODataModel(mPath, oParams);
			oModel.attachEvent("requestFailed", oDataFailed);

			function fnLoadMetadata() {
				oTable.setModel(oModel);
				oTable.setEntitySet(mEntity1);
				var oMeta = oModel.getServiceMetadata();
				var headerFields = "";
				for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
					var property = oMeta.dataServices.schema[0].entityType[0].property[i];
					headerFields += property.name + ",";
				}
				oTable.setInitiallyVisibleFields(headerFields);
			}

			oModel.attachMetadataLoaded(oModel, function () {
				fnLoadMetadata();
			});

			oModel.attachMetadataFailed(oModel, oDataFailed);
		},

		callCreate: function (oEvent) {
			var oTable = this.getView().byId("tblPOHeader");
			var oModel = oTable.getModel();
			//	var result = this.getView().getModel().getData();
			var oEntry = {};
			oEntry.PURCHASEORDERID = "0000000000";
			oEntry.PARTNERID = 100000000;
			oEntry.PRODUCTID = "HT-1000";
			oEntry.CURRENCY = "EUR";
			oEntry.GROSSAMOUNT = "1137.64";
			oEntry.NETAMOUNT = "956.00";
			oEntry.TAXAMOUNT = "181.64";
			oEntry.QUANTITY = "1.000";
			oEntry.QUANTITYUNIT = "EA";
			oEntry.DELIVERYDATE = new Date();

			oModel.setHeaders({
				"content-type": "application/json;charset=utf-8"
			});
			var mParams = {};
			mParams.success = function () {
				sap.ui.require(["sap/m/MessageToast"], (MessageToast) => {
					MessageToast.show("Create successful");
				});
			};
			mParams.error = onODataError;
			var mEntity1 = this.getOwnerComponent().getModel().getProperty("/mEntity1");
			oModel.create("/" + mEntity1, oEntry, mParams);
		}
	});
});