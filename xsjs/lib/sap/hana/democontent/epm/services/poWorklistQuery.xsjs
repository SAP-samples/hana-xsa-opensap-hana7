$.import("sap.hana.democontent.epm.services", "messages");
var MESSAGES = $.sap.hana.democontent.epm.services.messages;
$.import("sap.hana.democontent.epm.services", "session");
var SESSIONINFO = $.sap.hana.democontent.epm.services.session;

function getFilter() {
    function createFilterEntry(rs, attribute, obj) {
       
        console.log("add " + rs.getNString(1) + " " + attribute + " obj " + obj);
        return {
            "terms": rs.getNString(1),
            "attribute": attribute,
            "category": obj
        };
    }

    var body = '';
    var terms = $.request.parameters.get('query');
    
    var termList = terms.split(" ");
    var termStr = "";
    var i;
    for (i = 0; i < termList.length && i < 50; i++) {
        termStr += termList[i].replace(/\s+/g, '') + "* ";
    }
    terms = termStr;

    var conn = $.db.getConnection();
    var pstmt;
    var rs;
    var query;
    var list = [];

    try {
        // Business Partner Company Name
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(COMPANYNAME) FROM "MD.BusinessPartner" ' + ' WHERE CONTAINS(COMPANYNAME,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '001'), "businessPartner"));
        }

        rs.close();
        pstmt.close();
      
        // Business Partner City
         query = 'SELECT "CITY" FROM "get_buyer_city"(?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '007'), "businessPartner"));
        }

        rs.close();
        pstmt.close();

        // Product - Product Category
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(CATEGORY) FROM "MD.Products" ' + 'WHERE CONTAINS(CATEGORY,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '008'), "products"));
        }

        rs.close();
        pstmt.close();

        // Product - Product ID
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(PRODUCTID) FROM "MD.Products" ' + 'WHERE CONTAINS(PRODUCTID,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '009'), "products"));
        }

        rs.close();
        pstmt.close();

        // PO - PO ID
        query = 'SELECT TOP 50 DISTINCT TO_NVARCHAR(PURCHASEORDERID) FROM "PO.Header" ' + 'WHERE CONTAINS(PURCHASEORDERID,?)';
        pstmt = conn.prepareStatement(query);
        pstmt.setString(1, terms);
        rs = pstmt.executeQuery();

        while (rs.next()) {
            list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
                '002'), "purchaseOrder"));
        }
        
        rs.close();
        pstmt.close();

        conn.close();
     
    } catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.contentType = 'text/plain; charset=UTF-8';
         $.response.setBody("Search failed due to an internal server error. Check logs for details");
        $.trace.error("Exception raised:" + e.message);
        return;
    }
    body = JSON.stringify(list);
    $.trace.debug(body);
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}

function getTotalOrders() {
    function createTotalEntry(rs) {
        return {
            "name": rs.GROUP1,
            "value": rs.AMOUNT1
        };
    }

    var body = '';
    var ivGroupBy = $.request.parameters.get('groupby');
   
    var ivCurrency = $.request.parameters.get('currency');
   
    var list = [];

    switch (ivGroupBy) {
        case "COMPANYNAME":
            break;
        case "CATEGORY":
            break;
        case "CITY":
            break;
        case "POSTALCODE":
            break;
        case "PRODUCTID":
            break;

        default:
            $.trace.error("HTTP:BAD_REQUEST" + $.net.http.BAD_REQUEST);
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.contentType = 'text/plain; charset=UTF-8';
            $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '000', ivGroupBy));
            return;

    }
    if (ivCurrency === null) {
        ivCurrency = "EUR";
    }
    ivCurrency = ivCurrency.substring(0, 3);


    var CheckUpperCase = new RegExp('[A-Z]{3}');

    if (CheckUpperCase.test(ivCurrency) === true) {
        try {
            // not able to add Currency as prepared statement using setString so adding it in query directly
           var query = 'SELECT TOP 5 ' + ivGroupBy + ' AS GROUP1, SUM("CONVGROSSAMOUNT") AS AMOUNT1 FROM "core.models::PURCHASE_COMMON_CURRENCY"' + ' (\'PLACEHOLDER\' = (\'$$IP_O_TARGET_CURRENCY$$\', \'' + ivCurrency + '\')) group by ' + ivGroupBy + ' order by sum("CONVGROSSAMOUNT") desc';
            $.trace.debug(query);
            var conn = $.hdb.getConnection();
            var rs = conn.executeQuery(query);


            for (var i = 0; i < rs.length; i++) {
                list.push(createTotalEntry(rs[i]));
             }

            conn.close();
        } catch (e) {
            $.response.contentType = 'text/plain; charset=UTF-8';
            $.response.setBody(e.message);
            $.trace.error("Exception raised:" + e.message);
            return;
        }

        body = JSON.stringify({
            "entries": list
        });

        $.response.contentType = 'application/json; charset=UTF-8';
        $.response.setBody(body);
        $.response.status = $.net.http.OK;

    } else {
        $.trace.error("HTTP:BAD_REQUEST" + $.net.http.BAD_REQUEST);
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody(MESSAGES.getMessage('SEPM_BOR_MESSAGES', '053', encodeURI(ivCurrency)));
        return;
    }
}

function downloadExcel() {
    var body = '';

    try {
        var query = 'SELECT TOP 25000 "PurchaseOrderId", "PartnerId", "CompanyName", "CreatedByLoginName", "CreatedAt", "GrossAmount" ' + 'FROM "PO.HeaderView" order by "PurchaseOrderId"';

        $.trace.debug(query);
        var conn = $.hdb.getConnection();
        var rs = conn.executeQuery(query);

        body = MESSAGES.getMessage('SEPM_POWRK', '002') + "\t" + // Purchase
            // Order ID
            MESSAGES.getMessage('SEPM_POWRK', '003') + "\t" + // Partner ID
            MESSAGES.getMessage('SEPM_POWRK', '001') + "\t" + // Company Name
            MESSAGES.getMessage('SEPM_POWRK', '004') + "\t" + // Employee
            // Responsible
            MESSAGES.getMessage('SEPM_POWRK', '005') + "\t" + // Created At
            MESSAGES.getMessage('SEPM_POWRK', '006') + "\n"; // Gross Amount

        var i;
        for (i = 0; i < rs.length; i++) {
            body += rs[i].PurchaseOrderId + "\t" + rs[i].PartnerId + "\t" + rs[i].CompanyName + "\t" + rs[i].CreatedByLoginName + "\t" + rs[i].CreatedAt + "\t" + rs[i].GrossAmount + "\n";
        }
    } catch (e) {
      
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.contentType = 'text/plain; charset=UTF-8';
       $.response.setBody("Excel download Failed.Check logs for details.");
        $.trace.error("Exception raised:" + e.message);
        return;
    }

    $.response.setBody(body);
    $.response.contentType = 'application/vnd.ms-excel; charset=utf-16le';
    $.response.headers.set('Content-Disposition',
        'attachment; filename=Excel.xls');
    $.response.status = $.net.http.OK;
}

//Zip Functionality
function downloadZip() {
    var body = '';

    try {

        var query = 'SELECT TOP 25000 "PurchaseOrderId", "PartnerId", "CompanyName", "CreatedByLoginName", "CreatedAt", "GrossAmount" ' + 'FROM "PO.HeaderView" order by "PurchaseOrderId"';

        $.trace.debug(query);
        var conn = $.hdb.getConnection();
        var rs = conn.executeQuery(query);

        body = MESSAGES.getMessage('SEPM_POWRK', '002') + "\t" + // Purchase
            // Order ID
            MESSAGES.getMessage('SEPM_POWRK', '003') + "\t" + // Partner ID
            MESSAGES.getMessage('SEPM_POWRK', '001') + "\t" + // Company Name
            MESSAGES.getMessage('SEPM_POWRK', '004') + "\t" + // Employee
            // Responsible
            MESSAGES.getMessage('SEPM_POWRK', '005') + "\t" + // Created At
            MESSAGES.getMessage('SEPM_POWRK', '006') + "\n"; // Gross Amount

        var i;
        for (i = 0; i < rs.length; i++) {
            body += rs[i].PurchaseOrderId + "\t" + rs[i].PartnerId + "\t" + rs[i].CompanyName + "\t" + rs[i].CreatedByLoginName + "\t" + rs[i].CreatedAt + "\t" + rs[i].GrossAmount + "\n";
        }

        var zip = new $.util.Zip();
        zip["Excel.xls"] = body;

        $.response.status = $.net.http.OK;
        $.response.contentType = "application/zip";
        $.response.headers.set('Content-Disposition', "attachment; filename = Purchase.zip");
        $.response.setBody(zip.asArrayBuffer());

    } catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.contentType = 'text/plain; charset=UTF-8';
         $.response.setBody("Zipping data Failed. Check logs for details.");
        $.trace.error("Exception raised:" + e.message);
        return;
    }
}
//end of zip

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "filter":
        getFilter();
        break;
    case "getTotalOrders":
        getTotalOrders();
        break;
    case "Excel":
        downloadExcel();
        break;
    case "Zip":
        downloadZip();
        break;
    case "getSessionInfo":
        SESSIONINFO.fillSessionInfo();
        break;
    default:
        $.trace.error("Error:INTERNAL SERVER ERROR" + $.net.http.INTERNAL_SERVER_ERROR);
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.contentType = 'text/plain; charset=UTF-8';
        $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}