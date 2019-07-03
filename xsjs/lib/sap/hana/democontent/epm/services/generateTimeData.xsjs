$.response.contentType = "application/json";

try {
	var conn = $.db.getConnection();

	// get keys from MapKeys table
	var pstmt = conn.prepareStatement("CALL \"generateTimeData\"()");
	pstmt.executeQuery();

	conn.commit();

	$.response.status = $.net.http.OK;
	$.response.contentType = "application/json";
	var successBody = "{message:Time Dimensional Data Generated successfully}";
	var errorBody = "{message:Time Dimensional Data not generated}";
	$.response.setBody(JSON.stringify(successBody));
} catch (e) {
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	//	console.log(e.message);
	$.response.setBody(JSON.stringify(errorBody));

}

conn.close();