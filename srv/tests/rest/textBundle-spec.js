/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/textBundle", () => {
		
		it("/node/textBundle English", (done) => {
			request(this.app)
				.get("/node/textBundle")
				.set("Accept-Language", "en-USA")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.expect((res) => {
					expect(res.text.indexOf("Hello! Welcome to") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/textBundle German", (done) => {
			request(this.app)
				.get("/node/textBundle")
				.set("Accept-Language", "de")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.expect((res) => {
					expect(res.text.indexOf("Hallo! Willkommen bei") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/textBundle Japanese", (done) => {
			request(this.app)
				.get("/node/textBundle")
				.set("Accept-Language", "ja")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.expect((res) => {
					expect(res.text.indexOf("こんにちは！") !== -1).toBe(true);					
				})
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});