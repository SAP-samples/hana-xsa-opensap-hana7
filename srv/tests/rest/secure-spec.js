/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress(true);

	describe("Services that need Security", () => {
		it("/node/ex2/whoAmI", async(done) => {
			request(this.app)
				.get("/node/ex2/whoAmI")
				.set("Authorization", "bearer " + await this.test.getAuthToken())
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/userinfo", async(done) => {
			request(this.app)
				.get("/node/ex2/userinfo")
				.set("Authorization", "bearer " + await this.test.getAuthToken())
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
					expect(res.body.name.length).not.toBeLessThan(1);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});
	});
});