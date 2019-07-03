/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/cdsConv", () => {

		it("/node/cdsConv/view Bad View Input", (done) => {
			request(this.app)
				.get("/node/cdsConv/view/Junk")
				.expect(500)
				.end((error) => (error) ? done.fail(error) : done());
		});
		
		it("/node/cdsConv/view", (done) => {
			request(this.app)
				.get("/node/cdsConv/view/PO.HeaderView")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/cdsConv/table Bad Table Input", (done) => {
			request(this.app)
				.get("/node/cdsConv/table/Junk")
				.expect(500)
				.end((error) => (error) ? done.fail(error) : done());
		});
		
		it("/node/cdsConv/view", (done) => {
			request(this.app)
				.get("/node/cdsConv/table/PO.Header")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});