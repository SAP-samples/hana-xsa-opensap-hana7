/*eslint no-console: 0, no-unused-vars: 0, no-shadow:0, new-cap: 0*/
/*var zip = new $.util.Zip();
zip["folder1/demo1.txt"] = "This is the new ZIP Processing in XSJS";
zip["demo2.txt"] = "This is also the new ZIP Processing in XSJS";*/

var zip = new $.require("node-zip")();
zip.file("folder1/demo1.txt", "This is the new ZIP Processing in XSJS");
zip.file("demo2.txt", "This is also the new ZIP Processing in XSJS");
var data = zip.generate({base64:false,compression:"DEFLATE"});

$.response.status = $.net.http.OK;
$.response.contentType = "application/zip";
$.response.headers.set("Content-Disposition", "attachment; filename = \"ZipExample.zip\"");
$.response.setBody(data);