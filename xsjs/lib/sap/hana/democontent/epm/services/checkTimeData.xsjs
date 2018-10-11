$.response.contentType = "application/json";
var output = {
    entry: {}
};

try{
var conn = $.db.getConnection();

// get keys from MapKeys table
var pstmt = conn.prepareStatement('SELECT * from "Core.SHINE_TIME_DIM"');
var rs = pstmt.executeQuery();
var successBody = "{message:Data available}";
var errorBody="{message:Data unavailable}";
if(rs.next())
{
	console.log("Data available");
	conn.commit();
    $.response.status = $.net.http.OK;
    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify(successBody));
}

else
{
	console.log("Data unavailable");
	 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
     $.response.setBody(JSON.stringify(errorBody));
   
}


} catch (e){
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    console.log(e.message);
    $.response.setBody(JSON.stringify(errorBody));
    
}


conn.close();