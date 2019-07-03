/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */

var conn = $.hdb.getConnection();
var rs;
var query;

query = `SELECT * 
           FROM "PO.Header" 
           LIMIT 10`;

rs = conn.executeQuery(query);

for (let item of rs) {
	item.DISCOUNTAMOUNT = (item.GROSSAMOUNT - item.GROSSAMOUNT * .10);
}

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(rs));
$.response.status = $.net.http.OK;