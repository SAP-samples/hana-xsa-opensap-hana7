/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0*/
"use strict";

/**
@function JSON as returned by hdb 
*/
function hdbDirectTest(){
  var results = _selection();
//Pass output to response		
$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(results));

}

/**
@function Flattended JSON structure
*/
function hdbFlattenedTest(){
	outputJSON(_selection().EX_TOP_3_EMP_PO_COMBINED_CNT);
}

/**
@function load/call the procedure
*/
function _selection(){
	var connection = $.hdb.getConnection();

	var getPOHeaderData = connection.loadProcedure( 
		"get_po_header_data");

	var results = getPOHeaderData();
	return results;
}

/**
@function Puts a JSON object into the Response Object
@param {object} jsonOut - JSON Object
*/
function outputJSON(jsonOut){
	var out = [];
	for(var i=0; i<jsonOut.length;i++){
		out.push(jsonOut[i]);
	}
	$.response.status = $.net.http.OK;
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(out));
}


var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "direct":
	hdbDirectTest();
	break;
case "flattened":
	hdbFlattenedTest();
	break;	
default:
	hdbDirectTest();
	break;
}