function readUserIdSequence(){
/*	var rs, overAllId, responseBody;
	var conn = $.hdb.getConnection();
	rs = conn.executeQuery("SELECT \"userSeqId\".NEXTVAL as OverallId from DUMMY");
	overAllId = "";
	if (rs.length !== 0) {
	    overAllId = rs[0].OVERALLID;
	    responseBody = overAllId.toString();
	    $.response.status = $.net.http.OK;
	    $.response.setBody(responseBody);      
	}*/

}

//Clear the UserDetails Table data
function clearJobLogs(){
	
    var conn = $.hdb.getConnection();
    try{
        conn.executeUpdate("DELETE FROM \"UserData.User\"");
        conn.commit();
        conn.close();
    }
    catch(e){
    	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    	$.response.setBody("Error in deleting user details");
    }

}

function processRequest() {
    
		try {
            switch ($.request.method) {
                //Handle your GET calls here
                case $.net.http.GET:
                	readUserIdSequence();
                    break;
                case $.net.http.DEL:
                	clearJobLogs();
                	break;
                default:
                    $.response.status = $.net.http.METHOD_NOT_ALLOWED;
                    $.response.setBody("Wrong request method");
                    break;
            }
        } catch (e) {
        	$.response.status =  $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody("Failed to execute action: " + e.toString());
        }
}

processRequest();