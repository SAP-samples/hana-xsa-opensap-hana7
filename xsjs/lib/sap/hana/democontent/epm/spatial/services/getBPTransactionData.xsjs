function getData() {
    // encodeURI to avoud injection attacks
    var bpId = encodeURI($.request.parameters.get('bpId'));
        //for distance calculation
    var latitude=encodeURI($.request.parameters.get('lat'));
    var longitude=encodeURI($.request.parameters.get('long'));
    var userLatitude = encodeURI($.request.parameters.get('userlat'));
    var userLongitude = encodeURI($.request.parameters.get('userlong'));
    var output = {};
    var entry;
    var conn = $.hdb.getConnection();
    // get total sales amount
    var query = 
        'select sum(GROSSAMOUNT) as AMOUNT from ' 
        + '"SO.Header" ' 
        + 'where "PARTNER.PARTNERID" = ?';
    var rs = conn.executeQuery(query, bpId);

    if (rs.length < 1) {
        $.response.setBody("Failed to retieve data");
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    } else {
        output.salesTotal = rs[0].AMOUNT;
    }

    // get total sales amount per year
    if (output.salesTotal !== null) {
        query = 
            'select sum(GROSSAMOUNT) as AMOUNT, YEAR("HISTORY.CREATEDAT") AS YEAR from ' 
            + '"SO.Header" ' 
            + 'where "PARTNER.PARTNERID" = ?' + ' group by ' 
            + 'YEAR("HISTORY.CREATEDAT") order by YEAR("HISTORY.CREATEDAT")';
        
        rs = conn.executeQuery(query, bpId);

        if (rs.length < 1) {
            $.response.setBody("Failed to retieve data");
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        } else {

            output.salesYoY = [];

            var row;
            for (row = 0; row < rs.length; row++) {
                entry = {};
                entry.amount = rs[row].AMOUNT;
                entry.year = rs[row].YEAR;
                entry.currency = 'EUR';
                output.salesYoY.push(entry);
            } 
        } 
    }
    if( !isNaN(longitude) && !isNaN(latitude) && !isNaN(userLongitude) && !isNaN(userLatitude))
    {
        //for distance calculation
      query = 'select NEW ST_Point(\'POINT(' + userLongitude + " " + userLatitude + ')\',4326 ).ST_Distance( NEW ST_Point(\'POINT(' + longitude + " " + latitude + ')\',4326 ),\'meter\')'+
             'AS DISTANCE  from "spatial.models::BP_ADDRESS_DETAILS"';
    rs = conn.executeQuery(query);
    }
    if(rs.length < 1){
    	$.response.setBody("failed to retrieve data");
    	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    }
    else
    	{
    	output.distance=rs[0].DISTANCE;
    	}

    conn.close();

    $.response.setBody(JSON.stringify(output));
    $.response.contentType = "application/json";
    $.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "getData":
        getData();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody('Invalid Command: ' + aCmd);
}