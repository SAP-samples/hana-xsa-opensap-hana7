/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	const request = require("supertest");
	this.test = require("../../utils/tests");
	this.app = this.test.getExpress();

	describe("/node/ex2", () => {

		it("/node/ex2/", async(done) => {
			request(this.app)
				.get("/node/ex2")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.length).not.toBeLessThan(1);
					expect(res.body[0].CURRENT_SCHEMA.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/express", (done) => {
			request(this.app)
				.get("/node/ex2/express")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.Objects.length).not.toBeLessThan(1);
					expect(res.body.Objects[0].CURRENT_SCHEMA.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/waterfall", (done) => {
			request(this.app)
				.get("/node/ex2/waterfall")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.Objects.length).not.toBeLessThan(1);
					expect(res.body.Objects[0].CURRENT_SCHEMA.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/promises", (done) => {
			request(this.app)
				.get("/node/ex2/promises")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.Objects.length).not.toBeLessThan(1);
					expect(res.body.Objects[0].CURRENT_SCHEMA.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/await", (done) => {
			request(this.app)
				.get("/node/ex2/await")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.Objects.length).not.toBeLessThan(1);
					expect(res.body.Objects[0].CURRENT_SCHEMA.indexOf("OPENSAPHANA_HDI_CONTAINER") !== -1).toBe(true);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/procedures", (done) => {
			request(this.app)
				.get("/node/ex2/procedures")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT.length).not.toBeLessThan(2);
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT[0].FULLNAME).toBe("Fisher, Richard Andrew");
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/procedures2/1", (done) => {
			request(this.app)
				.get("/node/ex2/procedures2/1")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_BP_ADDRESSES.length).not.toBeLessThan(1);
					expect(res.body.EX_BP_ADDRESSES[0].PARTNERROLE).toBe("1");
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/procedures2/2", (done) => {
			request(this.app)
				.get("/node/ex2/procedures2/2")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_BP_ADDRESSES.length).not.toBeLessThan(1);
					expect(res.body.EX_BP_ADDRESSES[0].PARTNERROLE).toBe("2");
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/proceduresParallel", (done) => {
			request(this.app)
				.get("/node/ex2/proceduresParallel")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT.length).not.toBeLessThan(2);
					expect(res.body.EX_TOP_3_EMP_PO_COMBINED_CNT[0].FULLNAME).toBe("Fisher, Richard Andrew");
					expect(res.body.EX_BP_ADDRESSES.length).not.toBeLessThan(1);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/env", (done) => {
			request(this.app)
				.get("/node/ex2/env")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/org", (done) => {
			request(this.app)
				.get("/node/ex2/org")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/space", (done) => {
			request(this.app)
				.get("/node/ex2/space")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/hdb", (done) => {
			request(this.app)
				.get("/node/ex2/hdb")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.expect((res) => {
					expect(res.body.PurchaseOrders.length).not.toBeLessThan(1);
					expect(res.body.PurchaseOrders[0].PurchaseOrderId).toBe(500000000);
				})
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/os", (done) => {
			request(this.app)
				.get("/node/ex2/os")
				.expect(200)
				.expect("Content-Type", "application/json; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

		it("/node/ex2/osUser", (done) => {
			request(this.app)
				.get("/node/ex2/osUser")
				.expect(200)
				.expect("Content-Type", "text/plain; charset=utf-8")
				.end((error) => (error) ? done.fail(error) : done());
		});

	});
});