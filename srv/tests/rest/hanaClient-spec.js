/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/ex2", () => {

		it("/node/client", (done) => {
			request(this.app)
				.get("/node/client")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
					expect(res.body[0].SESSION_USER.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})				
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/client/err", (done) => {
			request(this.app)
				.get("/node/client/err")
				.expect(500)
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/client/context", (done) => {
			request(this.app)
				.get("/node/client/context")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
				})				
				.end((error) => (error) ? done.fail(error) : done());
		});
		
		
	});
});