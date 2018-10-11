$.response.contentType = "application/json";
var output = {
    entry: {}
};

try{
var conn = $.db.getConnection();

// get keys from MapKeys table
var pstmt = conn.prepareStatement('select count(*) from "SO.Header"');
  

var rs = pstmt.executeQuery();
var jsonString = '{"d":'+'{"icon": "sap-icon://sales-order","info": " ",';
var jsonString3 = '"numberDigits": 1,"numberFactor": "k","numberState": "Positive","subtitle": "No of SalesOrders"}}'; 
var successBody = "{message:Data available}";
var errorBody="{message:Data unavailable}";

if(rs.next())
{
	var count =  rs.getNString(1);
	console.log("count"+count);
	var jsonString2 = '"number":'+(count/1000)+',';
	var responseString = jsonString+jsonString2+jsonString3;
	console.log("response string"+responseString);
	var Response = JSON.parse(responseString);
	console.log("Response"+Response);
	conn.commit();
    $.response.status = $.net.http.OK;
    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify(Response));
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