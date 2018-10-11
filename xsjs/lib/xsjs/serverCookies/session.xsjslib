/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-redeclare: 0, camelcase:0, new-cap:0*/
/*eslint-env node, es6 */
"use strict";

/**
@author i809764 
**/

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
	if(typeof (input) !== "undefined" && input !== null)
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
@function Adds minutes to a starting date object
@param {date} date - Source date object
@param {integer} minutes - number of minutes to add to the date object
@returns {date} The newly calculated date
*/
function addMinutes(date, minutes){
	return new Date(date.getTime() + minutes*60000);
}

/**
@function Current date + 24 hours
@returns {string} The newly calculated date in timestamp format
*/
function calcTomorrow(){
	return addMinutes(new Date(), (24 * 60));
}

/**
@function Returns either the current session id (xsUtilSession) or creates a new one
@returns {String} Session Id
*/
function getSessionId(){
	var sessionId = $.request.cookies.get("xsUtilSession") || null;
	if(sessionId === null){
		var conn = $.db.getConnection();
		var pstmt;
		var rs;
		var query = "select \"sessionId\".NEXTVAL from dummy";
		pstmt = conn.prepareStatement(query);
		rs = pstmt.executeQuery();
		while (rs.next()) {
			sessionId =  rs.getInteger(1).toString();
			$.response.cookies.set("xsUtilSession", sessionId);
		}
	}
	return sessionId;
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

/**
@function Exception Object for variable lookup
@param {string} source - source function
@param {string} name - session variable name
@param {string} application - application name/id
@param {string} sessionId - Session ID
@returns {String} Error String
*/
function variableException(source, name,application,sessionId){
	this.source = source;
	this.name = name;
	this.application = application;
	this.sessionId = sessionId;
	this.message = "Invalid Variable ";
	
	this.toString = function() {
		return this.message + "name: " + this.name + " application: " + this.application + "session id: " + this.sessionId + " function: " + this.source;
	};
}

/**
@function Returns a session variable value
@param {string} name - session variable name
@param {string} application - application name/id
@returns {String} The NCLOB value stored in the session variable
*/
function get_session_variable(name, application){
	var sessionId = getSessionId();
	var output = "";
	var connection = $.hdb.getConnection();

	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");

	var results = ServerCookiesWrapper("GET_SESSION_VAR", sessionId, name, application, new Date(), null);
	if(typeof results.SVARIABLE[0] !== "undefined"){
		output = results.SVARIABLE[0].DATA;		
		connection.commit();
		connection.close();
		return output;
	} else {	
		throw new variableException("get_session_variable", name, application, sessionId);
	}
}

/**
@function Returns all session variable values for an application
@param {string} application - application name/id
@returns {object} A JSON object of all values stored in the session variables for this application
*/
function get_session_variables(application){
	var sessionId = getSessionId();
	var connection = $.hdb.getConnection();
	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");

	var results = ServerCookiesWrapper("GET_SESSION_VARS", sessionId, null, application, new Date(), null);
	var jsonOut = results.SVARIABLES;

	connection.commit();
	connection.close();
	return jsonOut;	
}

/**
@function Sets a session variable value
@param {string} name - session variable name
@param {string} application - application name/id
@param {any} value - any variable or object - will be converted to string
@param {optional date} expiry - expiry date/time for the variable defaults to 24 hours
@returns {boolean} successful?
*/
function set_session_variable(name, application, value, expiry){
	var sessionId = getSessionId();
	expiry = typeof expiry !== "undefined" ? expiry : calcTomorrow();
	
	var connection = $.hdb.getConnection();
	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");
	ServerCookiesWrapper("SET_SESSION_VAR", sessionId, name, application, expiry, value.toString());
	
	connection.commit();
	connection.close();		
}

/**
@function Returns an application variable value
@param {string} name - session variable name
@param {string} application - application name/id
@returns {String} The NCLOB value stored in the session variable
*/
function get_application_variable(name, application){
	var connection = $.hdb.getConnection();
	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");
	var output = "";	
	
	var results = ServerCookiesWrapper("GET_APP_VAR", null, name, application, new Date(), null);
	if(typeof results.SVARIABLE[0] !== "undefined"){
		output = results.SVARIABLE[0].DATA;		
		connection.commit();
		connection.close();
		return output;
	} else {	
		throw new variableException("get_application_variable", name, application);
	}
}

/**
@function Returns all applications variable values 
@param {string} application - application name/id
@returns {object} A JSON object of all values stored in the session variables for this application
*/
function get_application_variables(application){
	var connection = $.hdb.getConnection();
	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");
	var results = ServerCookiesWrapper("GET_APP_VARS", null, null, application,  new Date(), null);
	var jsonOut = results.SVARIABLES;

	connection.commit();
	connection.close();
	return jsonOut;
}

/**
@function Sets an application variable value
@param {string} name - session variable name
@param {string} application - application name/id
@param {any} value - any variable or object - will be converted to string
@param {optional date} expiry - expiry date/time for the variable defaults to 24 hours
@returns {boolean} successful?
*/
function set_application_variable(name, application, value, expiry){
	expiry = typeof expiry !== "undefined" ? expiry : calcTomorrow();
	
	var connection = $.hdb.getConnection();
	var ServerCookiesWrapper = connection.loadProcedure( 
		"ServerCookiesWrapper");
	ServerCookiesWrapper("SET_APP_VAR", null, name, application, expiry, value.toString());
	
	connection.commit();
	connection.close();	
}
