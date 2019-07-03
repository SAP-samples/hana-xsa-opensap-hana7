/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/ex2", () => {

		it("/node/excel", (done) => {
			request(this.app)
				.get("/node/excel/download")
				.expect(200)
				.expect("Content-Type", "application/vnd.ms-excel")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/xml", (done) => {
			request(this.app)
				.get("/node/xml/example1")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/zip", (done) => {
			request(this.app)
				.get("/node/zip/example1")
				.expect(200)
				.expect("Content-Type", "application/zip")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/zip/zipPO", (done) => {
			request(this.app)
				.get("/node/zip/zipPO")
				.expect(200)
				.expect("Content-Type", "application/zip")
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});