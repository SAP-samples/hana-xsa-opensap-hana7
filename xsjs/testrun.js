/*eslint no-console: 0*/
"use strict";

var xsjstest = require("@sap/xsjs-test");
var xsenv = require("@sap/xsenv");

var testResultsDir = "./.testresults";
var timestamp = Date.now();
var testResultFileName = timestamp + "_report";
var coverageFile = timestamp + "_coverage";

var options = {
    test: {
        format: "xml",
        pattern: ".*Test",
        reportdir: testResultsDir,
        filename: testResultFileName
    },
    coverage: {
        reporting: {
            reports: ["json"]
        },
        dir: testResultsDir,
        filename: coverageFile
    }
};


//configure HANA
try {
    options = Object.assign(options, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
    console.error(err);
}

// configure UAA
try {
    options = Object.assign(options, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
    console.error(err);
}

xsjstest(options).runTests();
