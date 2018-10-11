/*eslint no-console: 0, no-unused-vars: 0, no-use-before-define: 0, no-redeclare: 0, no-undef: 0, no-sequences: 0, no-unused-expressions: 0, quotes: 0*/
//To use a javascript controller its name must end with .controller.js
sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {
	"use strict";

	return Controller.extend("sap.shineNext.odataDeep.view.App", {

		onInit: function() {
			var model = new sap.ui.model.json.JSONModel({});
			this.getView().setModel(model);
			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
		},

		callCreateService: function() {
			var result = this.getView().getModel().getData();
			var oBusinessPartner = {};
			oBusinessPartner.PARTNERID = "0000000000";
			oBusinessPartner.EMAILADDRESS = result.Email;
			oBusinessPartner.COMPANYNAME = result.CompanyName;

			var oAddress = {};
			oAddress.ADDRESSID = "0000000000";
			oAddress.CITY = result.City;

			var oLink = {};
			oLink.uri = "$2";

			var xhr = new XMLHttpRequest();

			xhr.open("POST", '/sap/hana/democontent/epm/services/businessPartnersAddresses.xsodata/$batch', true);

			var token = getCSRFToken();
			xhr.setRequestHeader("X-CSRF-Token", token);

			xhr.setRequestHeader("Accept", 'application/json');
			xhr.setRequestHeader("Content-Type", 'multipart/mixed;boundary=batch');
			xhr.setRequestHeader("DataServiceVersion", '2.0');
			xhr.setRequestHeader("MaxDataServiceVersion", '2.0');

			var body = '';

			body += '--batch' + '\r\n';
			body += 'Content-Type:multipart/mixed;boundary=changeset' + '\r\n';
			body += 'Content-Transfer-Encoding:binary' + '\r\n';
			body += '\r\n';

			body += '--changeset' + '\r\n';
			body += 'Content-Type:application/http' + '\r\n';
			body += 'Content-Transfer-Encoding:binary\r\n';
			body += 'Content-ID: 1\r\n';
			body += '\r\n';

			body += 'POST BusinessPartners HTTP/1.1\r\n';
			body += "Content-Type: application/json\r\n";
			var jsonBP = JSON.stringify(oBusinessPartner);
			body += "Content-Length:" + jsonBP.length + '\r\n';
			body += '\r\n';
			body += jsonBP + '\r\n';
			body += '--changeset' + '\r\n';

			body += 'Content-Type:application/http' + '\r\n';
			body += 'Content-Transfer-Encoding:binary\r\n';
			body += 'Content-ID: 2\r\n';
			body += '\r\n';

			body += 'POST Addresses HTTP/1.1\r\n';
			body += "Content-Type:application/json\r\n";
			var jsonAdd = JSON.stringify(oAddress);
			body += "Content-Length:" + jsonAdd.length + '\r\n';
			body += '\r\n';

			body += jsonAdd + '\r\n';
			body += '--changeset' + '\r\n';

			body += 'Content-Type:application/http' + '\r\n';
			body += 'Content-Transfer-Encoding:binary\r\n';
			body += '\r\n';

			body += 'PUT $1/$links/AddRef HTTP/1.1\r\n';
			body += "Content-Type:application/json\r\n";
			var jsonLink = JSON.stringify(oLink);
			body += "Content-Length:" + jsonLink.length + '\r\n';
			body += '\r\n';

			body += jsonLink + '\r\n';

			body += '--changeset' + '--\r\n';
			body += '\r\n';

			body += '--batch' + '--\r\n';

			xhr.onload = function() {};
			xhr.send(body);
			sap.m.MessageToast.show("Business Partner created");
		}
	});
});