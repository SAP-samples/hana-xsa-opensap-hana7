/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0, no-use-before-define: 0, no-undef:0*/
"use strict";
//Pass output to response
var myModule = $.require("../../utils/myModule");		
$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(myModule.helloModule());