/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, camelcase:0*/
/*eslint-env node, es6 */
"use strict";

function po_create(param) {

	try {
		$.trace.error("Insert");
		var after = param.afterTableName;

		//Get Input New Record Values
		var pStmt = param.connection.prepareStatement(`select * from "${after}"`);
		var rs = null;
		rs = pStmt.executeQuery();
		var grossAmt = 0;
		var currency = "";
		$.trace.error("Before Read Partner");
		while (rs.next()) {
			grossAmt = rs.getDecimal(9);
			currency = rs.getString(8);
			let cur = new Intl.NumberFormat($.session.language, {
				style: "currency",
				currency: currency
			});
			$.trace.error(`Input Gross Amount: ${cur.format(grossAmt)}`);
		}
		pStmt.close();

		pStmt = param.connection.prepareStatement(
			`INSERT INTO "PurchaseOrder.Header" 
			      ("HISTORY.CREATEDAT", "HISTORY.CHANGEDAT", "HISTORY.CREATEDBY", "HISTORY.CHANGEDBY", PARTNER, 
			        NOTEID, CURRENCY, GROSSAMOUNT, NETAMOUNT, TAXAMOUNT, LIFECYCLESTATUS, APPROVALSTATUS, CONFIRMSTATUS, ORDERINGSTATUS, INVOICINGSTATUS ) 
			        values(now(), now(), null, null, '100000000', null, 'EUR', 100, 100, 100, 'N', 'I', 'I', 'I', 'I' )`
		);

		pStmt.executeUpdate();
		pStmt.close();

	} catch (e) {
		$.trace.error(e.toString());
		throw e;
	}
}