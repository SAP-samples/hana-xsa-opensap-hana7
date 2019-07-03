/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/myNode", () => {
		
		it("/node/myNode/", (done) => {
			request(this.app)
				.get("/node/myNode")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/myNode/products", (done) => {
			request(this.app)
				.get("/node/myNode/products")
				.expect(200)
				.expect("Content-Type", "application/vnd.ms-excel")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/myNode/env", (done) => {
			request(this.app)
				.get("/node/myNode/env")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/myNode/info", (done) => {
			request(this.app)
				.get("/node/myNode/info")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});