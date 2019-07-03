$.response.contentType = "application/json";
var output = {
    entry: []
};

var conn = $.hdb.getConnection();
// get data from BP_ADDRESS_DETAILS.attributeview
// model location : SHINE/spatial/models
var query = 
    'select PARTNERID,EMAILADDRESS,PHONENUMBER,WEBADDRESS,COMPANYNAME,LEGALFORM,' 
    + 'BUILDING,STREET,CITY,POSTALCODE,COUNTRY,REGION,LATITUDE,LONGITUDE FROM ' 
    + '"spatial.models::BP_ADDRESS_DETAILS"';
var rs = conn.executeQuery(query);
var bpEntry = {};

if (rs.length < 1) {
    $.response.setBody("Failed to retieve data");
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
} else {
    var row;
    for (row = 0; row < rs.length; row++) {
        bpEntry = {};
        bpEntry.ID = rs[row].PARTNERID;
        bpEntry.Name = rs[row].COMPANYNAME + ' ' + rs[row].LEGALFORM;
        bpEntry.Street = rs[row].STREET;
        bpEntry.Building = rs[row].BUILDING;
        bpEntry.Zip = rs[row].POSTALCODE;
        bpEntry.City = rs[row].CITY;
        bpEntry.Country = rs[row].COUNTRY;
        bpEntry.Email = rs[row].EMAILADDRESS;
        bpEntry.Phone = rs[row].PHONENUMBER;
        bpEntry.Web = rs[row].WEBADDRESS;
        bpEntry.Region = rs[row].REGION;
        bpEntry.lat = rs[row].LATITUDE;
        bpEntry.long = rs[row].LONGITUDE;

        output.entry.push(bpEntry);
    } 

    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
}

conn.close();