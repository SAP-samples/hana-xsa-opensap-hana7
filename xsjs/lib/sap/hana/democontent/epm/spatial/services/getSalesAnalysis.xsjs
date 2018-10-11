try {

    var requestBody = $.request.body.asString();

    var polygon = JSON.parse(requestBody);
    var i = 0;
    // create polygon search string
    var polygonString = 'NEW ST_Point(LATITUDE, LONGITUDE).ST_Within( NEW ST_Polygon(\'Polygon((';
    for (i; i < polygon.points.length; i++) {
        polygonString += polygon.points[i].lat + ' ' + polygon.points[i].long;
        if (i !== polygon.points.length - 1) {
            polygonString += ',';
        }
    }
    polygonString += "))'))";

    var conn = $.hdb.getConnection();
    var query;
    var rs;
    var cond;
    var entry;
    var body = {};

    // get the total sales amount for the region
    // make sure the polygon is complete i.e. first and last point are same
    query = 'select SUM(GROSSAMOUNT) AS AMOUNT,' + polygonString + ' AS COND from "spatial.models::REGION_SALES_BP" group by ' + polygonString;
    rs = conn.executeQuery(query);

    var totalSalesAmount = '';

    var row;
    for (row = 0; row < rs.length; row++) {
        // cond = parseInt(rs.getString(2), 10);
        cond = rs[row].COND;
        if (cond === 1) {
            body.totalSales = rs[row].AMOUNT;
        }
    }

    body.topBuyers = [];

    // get the top 5 buyers 
    // make sure the polygon is complete i.e. first and last point are same
    query = 'select PARTNERID,COMPANYNAME,LEGALFORM,LATITUDE,LONGITUDE,SUM(GROSSAMOUNT) AS AMOUNT,' + polygonString + ' AS COND from "spatial.models::REGION_SALES_BP" group by PARTNERID,COMPANYNAME,LEGALFORM,LATITUDE,LONGITUDE,' + polygonString + ' order by SUM(GROSSAMOUNT) desc';
    rs = conn.executeQuery(query);

    var count = 0;
    for (row = 0; row < rs.length; row++) {
        cond = rs[row].COND;
        if (cond === 1) {
            count++;
            entry = {};
            entry.partnerID = rs[row].PARTNERID;
            entry.companyName = rs[row].COMPANYNAME;
            entry.legalForm = rs[row].LEGALFORM;
            entry.totalSales = rs[row].AMOUNT;
            entry.lat = rs[row].LATITUDE;
            entry.long = rs[row].LONGITUDE;
            body.topBuyers.push(entry);
        }
        if (count >= 5) {
            break;
        }
    }

    // get the sales amount year over year
    // make sure the polygon is complete i.e. first and last point are same
    query = 'select YEAR_OF_SALE,SUM(GROSSAMOUNT) AS AMOUNT,' + polygonString + ' AS COND from "spatial.models::REGION_SALES_BP" group by YEAR_OF_SALE,' + polygonString + ' order by YEAR_OF_SALE';
    rs = conn.executeQuery(query);

    body.salesYoY = [];

    for (row = 0; row < rs.length; row++) {
        cond = rs[row].COND;
        if (cond === 1) {
            entry = {};
            entry.year = rs[row].YEAR_OF_SALE;
            entry.salesAmount = rs[row].AMOUNT;
            body.salesYoY.push(entry);
        }
    }

    $.response.contentType = 'application/json';
    $.response.setBody(JSON.stringify(body));
    $.response.status = $.net.http.OK;

    conn.close();

} catch (e) {
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(e.message);
}