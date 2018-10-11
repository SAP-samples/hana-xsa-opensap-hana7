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
			var userModel = this.getOwnerComponent().getModel("userModel");
			var oTable = this.getView().byId("userTable");
			oTable.setModel(userModel);
			
			var urlMulti = "/sap/hana/democontent/epm/services/poWorklistJoin.xsodata";
			var urlSimple = "/sap/hana/democontent/epm/services/businessPartners.xsodata";
			this.getOwnerComponent().getModel().setProperty("/mPath", urlMulti);
			this.getOwnerComponent().getModel().setProperty("/sPath", urlSimple);
			this.getOwnerComponent().getModel().setProperty("/mEntity1", "PurchaseOrderHeader");
			this.getOwnerComponent().getModel().setProperty("/mEntity2", "PurchaseOrderItem");
			this.getOwnerComponent().getModel().setProperty("/sEntity1", "BusinessPartners");
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
		
		callSingleService: function(){
			var oTable = this.getView().byId("tblBPHeader");

			var sPath = this.getOwnerComponent().getModel().getProperty("/sPath");
			var sEntity1 = this.getOwnerComponent().getModel().getProperty("/sEntity1");

			var oParams = {};
			oParams.json = true;
			oParams.useBatch = true;
			var oModel = new sap.ui.model.odata.v2.ODataModel(sPath, oParams);
			oModel.attachEvent("requestFailed", oDataFailed);

			function fnLoadMetadata() {
				oTable.setModel(oModel);
				oTable.setEntitySet(sEntity1);
		
				var oMeta = oModel.getServiceMetadata();
				var headerFields = "";
				for (var i = 0; i < oMeta.dataServices.schema[0].entityType[0].property.length; i++) {
					var property = oMeta.dataServices.schema[0].entityType[0].property[i];
					headerFields +=  property.name + ",";
				}
				oTable.setInitiallyVisibleFields(headerFields);
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
		},
		
	callUserService: function() {
		var oModel = this.getOwnerComponent().getModel("userModel");
		var result = this.getView().getModel().getData();
		var oEntry = {};
		oEntry.UserId = "0000000000";
		oEntry.FirstName = result.FirstName;
		oEntry.LastName = result.LastName;
		oEntry.Email = result.Email;

		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});
		var mParams = {};
		mParams.success = function() {
			sap.m.MessageToast.show("Create successful");
		};
		mParams.error = this.onErrorCall;
		oModel.create("/Users", oEntry, mParams);
	},

	callUserUpdate: function() {
		var oModel = this.getOwnerComponent().getModel("userModel");
		oModel.setHeaders({
			"content-type": "application/json;charset=utf-8"
		});

		var mParams = {};
		mParams.error = function() {
			sap.m.MessageToast.show("Update failed");
		};
		mParams.success = function() {
			sap.m.MessageToast.show("Update successful");
		};

		oModel.submitChanges(mParams);
	},

	onErrorCall: function(oError) {
		if (oError.statusCode === 500 || oError.statusCode === 400) {
			var errorRes = JSON.parse(oError.responseText);
			if (!errorRes.error.innererror) {
				sap.m.MessageBox.alert(errorRes.error.message.value);
			} else {
				if (!errorRes.error.innererror.message) {
					sap.m.MessageBox.alert(errorRes.error.innererror.toString());
				} else {
					sap.m.MessageBox.alert(errorRes.error.innererror.message);
				}
			}
			return;
		} else {
			sap.m.MessageBox.alert(oError.response.statusText);
			return;
		}

	}		
	});
});