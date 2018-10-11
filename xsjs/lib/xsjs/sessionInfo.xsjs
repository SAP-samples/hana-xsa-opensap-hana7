$.response.contentType = "text/html";
//var sOutput = "Client Filter Tests! <br><br>";

var oConn = $.hdb.getConnection();

var sQuery = "select * from \"M_SESSION_CONTEXT\" ";
var aRs = oConn.executeQuery(sQuery);

if (aRs.length < 1) {
	$.response.setBody("Failed to retrieve data");
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
	$.response.status = $.net.http.OK;
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(aRs));
	//sOutput += "This is the response from my SQL: " + aRs[0].DUMMY;
	// $.response.setBody(sOutput);
}
oConn.close();