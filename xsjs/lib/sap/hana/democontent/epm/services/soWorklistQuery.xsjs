$.import("sap.hana.democontent.epm.services", "messages");
var MESSAGES = $.sap.hana.democontent.epm.services.messages;
$.import("sap.hana.democontent.epm.services", "session");
var SESSIONINFO = $.sap.hana.democontent.epm.services.session;

//Get Sales Orders filtered by the specified attribute value.
function getFilter() {
    function createFilterEntry(rs, attribute, obj) { 
        return {
            "score": rs.SCORE,
            "terms": rs.COMPANYNAME,
            "attribute": attribute,
            "category": obj
        };
    }

    var body = '';
    var terms = $.request.parameters.get("query");
    terms = terms.replace("'","");
    var conn = $.hdb.getConnection();
    var rs;
    var query;
    var list = [];
    var i;

    try {

        // Business Partner Company Name	

        query = 'SELECT TO_INT(SCORE()*100)/100 AS SCORE, TO_NVARCHAR(COMPANYNAME) AS COMPANYNAME FROM "core.models::BUYER" ' + ' WHERE CONTAINS("COMPANYNAME",?,FUZZY( 0.7 , \'similarCalculationMode=symmetricsearch\')) ORDER BY score DESC';
        rs = conn.executeQuery(query, terms);

        for (i = 0; i < rs.length; i++) {
            list.push(createFilterEntry(rs[i], MESSAGES.getMessage('SEPM_POWRK',
                '001'), "company"));
        }

        // Business Partner City
        query = 'SELECT TO_INT(SCORE()*100)/100 AS score, TO_NVARCHAR(CITY) AS COMPANYNAME FROM "core.models::BUYER" ' + ' WHERE CONTAINS("CITY",?,FUZZY( 0.7 , \'similarCalculationMode=symmetricsearch\')) ORDER BY score DESC';
        rs = conn.executeQuery(query, terms);

        for (i = 0; i < rs.length; i++) {
            list.push(createFilterEntry(rs[i], MESSAGES.getMessage('SEPM_POWRK',
                '007'), "businessPartner"));
        }

        conn.close();
    } catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }
    body = JSON.stringify(list);
    $.trace.debug(body);
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}


var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "filter":
        getFilter();
        break;
    case "getSessionInfo":
        SESSIONINFO.fillSessionInfo();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}