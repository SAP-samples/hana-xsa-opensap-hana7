"use strict";

module.exports = {
   fill: function(){
   	var tableOfContents =
   	"</p>" +
   	"<H1>Overall Node.js Examples Table of Contents</H1></br>" +
   	"<a href=\"/node/\">/node/</a> - Node.js HANA Database Examples</br>" +
   	"<a href=\"/node/excAsync\">/node/excAsync</a> - Node.js Asynchronous Non-Blocking I/O Examples</br>" +
   	"<a href=\"/node/textBundle\">/node/textBundle</a> - Node.js Text Bundles and Language Processing Examples</br>" +
	"<a href=\"/node/chat\">/node/chat</a> - Node.js Web Socket Chat Server Example</br>" +   	
	"<a href=\"/node/excel\">/node/excel</a> - Node.js Excel Upload and Download Examples</br>" +	
	"<a href=\"/node/xml\">/node/xml</a> - Node.js XML Parsing Examples</br>" +	
	"<a href=\"/node/zip\">/node/zip</a> - Node.js ZIP archive Examples</br>" +	
	"<a href=\"/node/cds\">/node/cds</a> - Node.js CDS/XSDS Examples</br>"+
	"<a href=\"/node/auditLog\">/node/auditLog</a> - Node.js AuditLog Examples</br>"+	
	"<a href=\"/node/JavaScriptBasics\">/node/JavaScriptBasics</a> - Node.js JavaScript Basics</br>"+	
	"<a href=\"/node/promises\">/node/promises</a> - Node.js Promises Examples</br>"+	
	
	"</p>" +
	"<H1>XSJS Compatibility Mode Table of Contents</H1></br>" +
   	"<a href=\"/xsjs/index.xsjs\">/xsjs/</a> - XS Home Page</br>" +
   	"<a href=\"/xsjs/antivirus.xsjs\">/xsjs/antivirus.xsjs</a> - XSJS Antivirus API Example</br>" +
   	"<a href=\"/xsjs/excel.xsjs\">/xsjs/excel.xsjs</a> - XSJS Calling Node.js Excel Module Example</br>" +
	"<a href=\"/xsjs/exercisesMaster.xsjs?cmd=getSessionInfo\">/xsjs/exercisesMaster.xsjs</a> - XSJS Simple Example</br>" +   	
	"<a href=\"/xsjs/hdb.xsjs\">/xsjs/hdb.xsjs</a> -XSJS Simple Database Select Example</br>" +	
	"<a href=\"/xsjs/hello.xsjs\">/xsjs/hello.xsjs</a> - XSJS Return Session User and Application User Example</br>" +	
	"<a href=\"/xsjs/os.xsjs\">/xsjs/os.xsjs</a> - XSJS Interact with OS via Node.js Module Example</br>" +	
	"<a href=\"/xsjs/procedures.xsjs\">/xsjs/procedures.xsjs</a> - XSJS Call Stored Procedures Example</br>" +
	"<a href=\"/xsjs/require.xsjs\">/xsjs/require.xsjs</a> - XSJS Node.js Module Example</br>" +	
	"<a href=\"/xsjs/whoAmI.xsjs\">/xsjs/whoAmI.xsjs</a> - XSJS Different User Types Example</br>" +
	"<a href=\"/xsjs/xml.xsjs\">/xsjs/xml.xsjs</a> - XSJS XML SAX Parser API Example</br>" +
	"<a href=\"/xsjs/zip.xsjs\">/xsjs/zip.xsjs</a> - XSJS ZIP API Example</br>" +
	
	"</p>" +
	"<H1>XSODATA Table of Contents</H1></br>" +
   	"<a href=\"/xsodata/businessPartners.xsodata/?$format=json\">businessPartners.xsodata</a> Business Partners Service</br>" +
   	"<a href=\"/xsodata/businessPartners.xsodata/$metadata\">businessPartners.xsodata/$metadata</a> Business Partners Service Metadata</br>" +   	
   	"<a href=\"/xsodata/businessPartners.xsodata/BusinessPartners?$format=json\">businessPartners.xsodata/BusinessPartners</a> Business Partners Data</br>" +
   	"<a href=\"/xsodata/businessPartners.xsodata/BusinessPartners?$format=json&$top=3&$skip=5\">businessPartners.xsodata/BusinessPartners/?$skip=5&$top=3</a> Business Partners Data - Skip 5, Only Return Top 3</br>" +   	

   	"<a href=\"/xsodata/purchaseOrders.xsodata/?$format=json\">purchaseOrders.xsodata</a> Purchase Orders Service</br>" +   	
   	"<a href=\"/xsodata/purchaseOrders.xsodata/$metadata\">purchaseOrders.xsodata/$metadata</a> Purchase Orders Service Metadata</br>" + 
   	"<a href=\"/xsodata/purchaseOrders.xsodata/POHeader?$format=json&$top=10\">purchaseOrders.xsodata/POHeader</a> Purchase Orders Service - Header Data</br>" +    	
	"<a href=\"/xsodata/purchaseOrders.xsodata/POHeader?$format=json&$top=10&$expand=POItem\">purchaseOrders.xsodata/POHeader/?$expand=POItem</a> Purchase Orders Service - Header Data with Expanded Items</br>" +    	

   	"<a href=\"/user/xsodata/user2.xsodata/?$format=json\">user2.xsodata</a> User Service</br>" +
   	"<a href=\"/user/xsodata/user2.xsodata/$metadata\">user2.xsodata/$metadata</a> User Service Metadata </br>";   	
	
   	return tableOfContents;
   	
   }
};
