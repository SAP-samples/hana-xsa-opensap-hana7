/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var os = $.require("os");
var output = {};

output.tmpdir = os.tmpdir();
output.endianness = os.endianness();
output.hostname = os.hostname();
output.type = os.type();
output.platform = os.platform();
output.arch = os.arch();
output.release = os.release();
output.uptime = os.uptime();
output.loadavg = os.loadavg();
output.totalmem = os.totalmem();
output.freemem = os.freemem();
output.cpus = os.cpus();
output.networkInfraces = os.networkInterfaces();


$.response.status = $.net.http.OK;
$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(output));