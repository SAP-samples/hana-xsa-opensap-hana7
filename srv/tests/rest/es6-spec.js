/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();
	describe("/node/es6", () => {

		it("/node/es6/constants", (done) => {
			request(this.app)
				.get("/node/es6/constants")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/blockScoped", (done) => {
			request(this.app)
				.get("/node/es6/blockScoped")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/parameterDefaults", (done) => {
			request(this.app)
				.get("/node/es6/parameterDefaults")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/parameterMultiple", (done) => {
			request(this.app)
				.get("/node/es6/parameterMultiple")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});		

		it("/node/es6/unicode", (done) => {
			request(this.app)
				.get("/node/es6/unicode")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/numFormat", (done) => {
			request(this.app)
				.get("/node/es6/numFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/currFormat", (done) => {
			request(this.app)
				.get("/node/es6/currFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/dateFormat", (done) => {
			request(this.app)
				.get("/node/es6/dateFormat")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/classes1", (done) => {
			request(this.app)
				.get("/node/es6/classes1")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});		

		it("/node/es6/classes1Error", (done) => {
			request(this.app)
				.get("/node/es6/classes1Error")
				.expect(200)
				.end((error) => (error) ? done.fail(error) : done());
		});	

		it("/node/es6/classes2a", (done) => {
			request(this.app)
				.get("/node/es6/classes2a")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});	

		it("/node/es6/classes2b", (done) => {
			request(this.app)
				.get("/node/es6/classes2b")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});	

		it("/node/es6/classes3a", (done) => {
			request(this.app)
				.get("/node/es6/classes3a")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});	

		it("/node/es6/classes3b", (done) => {
			request(this.app)
				.get("/node/es6/classes3b")
				.expect(200)
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/es6/classes4a", (done) => {
			request(this.app)
				.get("/node/es6/classes4a")
				.expect(200)
				.expect("Content-Type", "text/html; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});	

		it("/node/es6/classes4b", (done) => {
			request(this.app)
				.get("/node/es6/classes4b")
				.expect(200)
				.end((error) => (error) ? done.fail(error) : done());
		});
		
	});
});