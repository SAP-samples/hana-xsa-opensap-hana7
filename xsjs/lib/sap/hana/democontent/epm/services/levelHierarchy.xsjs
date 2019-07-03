/* for impelementing level hierarchy*/
$.import("sap.hana.democontent.epm.services", "messages");
var MESSAGES = $.sap.hana.democontent.epm.services.messages;

    var list = [];
    var body = "";
    
 function createTotalEntry(rs) {
        return {
            "COUNTRY": rs.COUNTRY,
            "TOTAL_SALES": rs.TOTAL_SALES
        };
     
 }
    
function getHierarchyData()
{
    var conn = $.hdb.getConnection();
    var region = $.request.parameters.get("region");
    region = region.replace("'", ""); 
    var rs;
try
{

  var query = 'SELECT  "COUNTRY",SUM("TOTAL_SALES") AS "TOTAL_SALES" FROM "core.models::SALESORDER_DYNAMIC_JOIN"'+' WHERE "COUNTRY" IN (SELECT "QUERY_NODE_NAME"'+
           ' FROM "core.models::SALESORDER_DYNAMIC_JOIN/REGION_COUNTRY_LEVEL/hier/REGION_COUNTRY_LEVEL"' +' WHERE PRED_NODE = ?)'+
            'GROUP BY "COUNTRY"';                

 rs = conn.executeQuery(query, "[REGION].[" + region + "]");
  var i;
 
         for (i = 0; i < rs.length; i++) {
            list.push(createTotalEntry(rs[i]));
        }

        conn.close();
} 
    
    catch (e)
    {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }

    body = JSON.stringify({SalesByCountry:list});
    $.trace.debug(body);
    $.response.contentType = "application/json";
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
    case "getHierarchyData":
        getHierarchyData();
        break;
  
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(MESSAGES.getMessage("SEPM_ADMIN", "002", aCmd));
}        

    
    
