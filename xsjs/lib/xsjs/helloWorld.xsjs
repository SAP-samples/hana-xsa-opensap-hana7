$.response.contentType = "text/html";
var sOutput = "Hello, World! <br><br>";

var oConn = $.hdb.getConnection();
var sQuery = "select * from DUMMY";
var aRs = oConn.executeQuery(sQuery);

if (aRs.length < 1) {
    $.response.setBody("Failed to retrieve data");
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
    sOutput += "This is the response from my SQL: " + aRs[0].DUMMY;
    $.response.setBody(sOutput);
}
oConn.close(); 