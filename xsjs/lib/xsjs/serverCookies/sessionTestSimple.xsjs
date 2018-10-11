/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0, camelcase:0, new-cap:0*/
/*eslint-env node, es6 */
"use strict";

/**
@author i809764 
**/
$.import("xsjs.serverCookies", "session");
var SESSION = $.xsjs.serverCookies.session;

SESSION.set_session_variable("test", "SessionTest", "Test1");
SESSION.set_application_variable("test", "SessionTest", "Application Test1");

var conn = $.db.getConnection();
var pstmt;
var rs;
var query = "select USER_NAME, USER_MODE, CREATOR from users";
pstmt = conn.prepareStatement(query);
rs = pstmt.executeQuery();
var jsonOut = SESSION.recordSetToJSON(rs, "Tables");
pstmt.close();
conn.commit();
conn.close();
SESSION.set_application_variable("tables", "SessionTest", JSON.stringify(jsonOut));


//var expiry = SESSION.calcTomorrow();
$.response.contentType = "application/json";
var body = SESSION.get_application_variable("tables", "SessionTest");
$.response.setBody(body);
$.response.status = $.net.http.OK;