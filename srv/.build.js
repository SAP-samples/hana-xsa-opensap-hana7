/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0, quotes:0 */
/*eslint-env node, es6 */

// Executes the CDS build depending on whether we have a top-level package.json.
// Package.json is not available when we are called by CF/XSA buildpack.  In this case we don't do anything
// and just assume our model was already built and is available as part of this DB app.
//
// This is a workaround that will be replaced by a solution where CDS generates the DB module along with package.json.

const fs = require("fs");
const childproc = require("child_process");

if (fs.existsSync("../package.json")) {
    // true at build-time, false at CF staging time
    childproc.execSync("npm install && npm run build", {
        cwd: "..",
        stdio: "inherit"
    });
}
