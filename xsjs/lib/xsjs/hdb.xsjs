/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

if (!$.session.hasAppPrivilege("Display")) {
	$.response.setBody("Not Authorized");
	$.response.contentType = "text/plain";
	$.response.status = $.net.http.UNAUTHORIZED;
} else {
	var conn = $.hdb.getConnection();
	var query =
		`SELECT FROM OPENSAP_PURCHASEORDER_ITEMVIEW { 
	         PURCHASEORDERID as "PurchaseOrderId", 
             PRODUCT as "ProductID", 
             GROSSAMOUNT as "Amount" 
             } `;
	var rs = conn.executeQuery(query);
	$.response.setBody(JSON.stringify(rs));
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;
}