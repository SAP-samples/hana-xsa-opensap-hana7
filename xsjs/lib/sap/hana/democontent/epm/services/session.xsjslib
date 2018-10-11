/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0*/
"use strict";

/**  
@function Outputs the Session user and Language as JSON in the Response body
*/
function fillSessionInfo(){
	var body = "";
	body = JSON.stringify({
		"session" : [{"UserName": $.session.getUsername(), "Language": $.session.language}] 
	});
	$.response.contentType = "application/json"; 
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/**
@function Escape Special Characters in JSON strings
@param {string} input - Input String
@returns {string} the same string as the input but now escaped
*/
function escapeSpecialChars(input) {
	if(typeof (input) !== "undefined" && input !== null)
	{	
	return input
    .replace(/[\\]/g, "\\\\")
    .replace(/[\"]/g, "\\\"")
    .replace(/[\/]/g, "\\/")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t"); }
	else{
		
		return "";
	}
}

/**
@function Escape Special Characters in Text strings (CSV and Tab Delimited)
@param {string} input - Input String
@returns {string} the same string as the input but now escaped
*/
function escapeSpecialCharsText(input) {
	if(typeof (input) !== "undefined" && input != null)
	{	
	input.replace(/[\"]/g, "\"\"");
	if(input.indexOf(",") >= 0 ||
	   input.indexOf("\t") >= 0 ||
	   input.indexOf(";") >= 0 ||
	   input.indexOf("\n") >= 0 ||
	   input.indexOf("\"") >= 0 )
	{input = "\""+input+"\"";}
	
	return input;
	}
	else{
		
		return "";
	}
}

/**
@function Converts any XSJS RecordSet object to a Text String output
@param {object} rs - XSJS Record Set object
@param {optional Boolean} bHeaders - defines if you want column headers output as well; defaults to true
@param {optional String} delimiter - supplies the delimiter used between columns; defaults to tab (\\t)
@returns {String} The text string with the contents of the record set
*/
function recordSetToText(rs,bHeaders,delimiter){
	bHeaders = typeof bHeaders !== "undefined" ? bHeaders : true;
	delimiter = typeof delimiter !== "undefined" ? delimiter : "\t"; //Default to Tab Delimited
	
	var outputString = "";
	var value = "";
	var meta = rs.getMetaData();
	var colCount = meta.getColumnCount();
	
	//Process Headers
	if(bHeaders){
		for (var i=1; i<=colCount; i++) {
			outputString += escapeSpecialCharsText(meta.getColumnLabel(i)) + delimiter;			
		}
		outputString += "\n";  //Add New Line
	}
	while (rs.next()) {
		for (var i=1; i<=colCount; i++) {
		     switch(meta.getColumnType(i)) {
		     case $.db.types.VARCHAR:
		     case $.db.types.CHAR: 
		          value += rs.getString(i);
		          break;
		     case $.db.types.NVARCHAR:
		     case $.db.types.NCHAR: 
		     case $.db.types.SHORTTEXT:
		          value += rs.getNString(i);
		          break;
		     case $.db.types.TINYINT:
		     case $.db.types.SMALLINT:
		     case $.db.types.INT:
		     case $.db.types.BIGINT:
		          value += rs.getInteger(i);
		          break;
		     case $.db.types.DOUBLE:
		          value += rs.getDouble(i);
		          break;
		     case $.db.types.DECIMAL:
		          value += rs.getDecimal(i);
		          break;
		     case $.db.types.REAL:
		          value += rs.getReal(i);
		          break;
		     case $.db.types.NCLOB:
		     case $.db.types.TEXT:
		          value += rs.getNClob(i);
		          break;
		     case $.db.types.CLOB:
		          value += rs.getClob(i);
		          break;	          
		     case $.db.types.BLOB:
		    	  value += $.util.convert.encodeBase64(rs.getBlob(i));
		          break;	          
		     case $.db.types.DATE:
		          value += rs.getDate(i);
		          break;
		     case $.db.types.TIME:
		          value += rs.getTime(i);
		          break;
		     case $.db.types.TIMESTAMP:
		          value += rs.getTimestamp(i);
		          break;
		     case $.db.types.SECONDDATE:
		          value += rs.getSeconddate(i);
		          break;
		     default:
		          value += rs.getString(i);
		     }
			   outputString += escapeSpecialCharsText(value) + delimiter;
			   value = "";
		     }
			outputString += "\n";  //Add New Line
		}
	
	
	return outputString;
}

/**
@function Converts any XSJS RecordSet object to a JSON Object
@param {object} rs - XSJS Record Set object
@param {optional String} rsName - name of the record set object in the JSON
@returns {object} JSON representation of the record set data
*/
function recordSetToJSON(rs,rsName){
	rsName = typeof rsName !== "undefined" ? rsName : "entries";
	
	var meta = rs.getMetaData();
	var colCount = meta.getColumnCount();
	var values=[];
	var table=[];
	var value="";
	while (rs.next()) {
	for (var i=1; i<=colCount; i++) {
		value = "\""+meta.getColumnLabel(i)+"\" : ";
	     switch(meta.getColumnType(i)) {
	     case $.db.types.VARCHAR:
	     case $.db.types.CHAR: 
	          value += "\""+ escapeSpecialChars(rs.getString(i))+"\"";
	          break;
	     case $.db.types.NVARCHAR:
	     case $.db.types.NCHAR: 
	     case $.db.types.SHORTTEXT:
	          value += "\""+escapeSpecialChars(rs.getNString(i))+"\"";
	          break;
	     case $.db.types.TINYINT:
	     case $.db.types.SMALLINT:
	     case $.db.types.INT:
	     case $.db.types.BIGINT:
	          value += rs.getInteger(i);
	          break;
	     case $.db.types.DOUBLE:
	          value += rs.getDouble(i);
	          break;
	     case $.db.types.DECIMAL:
	          value += rs.getDecimal(i);
	          break;
	     case $.db.types.REAL:
	          value += rs.getReal(i);
	          break;
	     case $.db.types.NCLOB:
	     case $.db.types.TEXT:
	          value += "\""+ escapeSpecialChars(rs.getNClob(i))+"\"";
	          break;
	     case $.db.types.CLOB:
	          value += "\""+ escapeSpecialChars(rs.getClob(i))+"\"";
	          break;	          
	     case $.db.types.BLOB:
	    	  value += "\""+ $.util.convert.encodeBase64(rs.getBlob(i))+"\"";
	          break;	          
	     case $.db.types.DATE:
	    	 var dateTemp = new Date();
	    	 dateTemp.setDate(rs.getDate(i));
	    	 var dateString = dateTemp.toJSON();
	         value += "\""+dateString+"\"";
	          break;
	     case $.db.types.TIME:
	    	 var dateTemp = new Date();
	    	 dateTemp.setDate(rs.getTime(i));
	    	 var dateString = dateTemp.toJSON();
	         value += "\""+dateString+"\"";
	          break;
         case $.db.types.TIMESTAMP:
             var dateTemp = new Date();
             dateTemp.setDate(rs.getTimestamp(i));
             var dateString = dateTemp.toJSON();
             value += "\""+dateString+"\"";
             break;
	     case $.db.types.SECONDDATE:
	    	 var dateTemp = new Date();
	    	 dateTemp.setDate(rs.getSeconddate(i));
	    	 var dateString = dateTemp.toJSON();
	         value += "\""+dateString+"\"";
	          break;
	     default:
	          value += "\""+escapeSpecialChars(rs.getString(i))+"\"";
	     }
	     values.push(value);
	     }
	   table.push("{"+values+"}");
	}
	return 	JSON.parse("{\""+ rsName +"\" : [" + table	+"]}");

}
