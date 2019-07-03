/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/JavaScriptBasics", () => {

		it("/node/JavaScriptBasics/dates", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/dates")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/array", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/array")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/json", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/json")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
					expect(res.body[0].PURCHASEORDERID).toBe(300000000);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/objects", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/objects")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/strings", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/strings")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/classes", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/classes")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/constants", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/constants")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/blockScoped", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/blockScoped")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/parameterDefaults", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/parameterDefaults")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/parameterMultiple", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/parameterMultiple")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/unicode", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/unicode")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/numFormat", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/numFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/currFormat", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/currFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/JavaScriptBasics/dateFormat", (done) => {
			request(this.app)
				.get("/node/JavaScriptBasics/dateFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});