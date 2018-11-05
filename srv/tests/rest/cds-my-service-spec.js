/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
const request = require("supertest");
this.test = require("../../utils/tests");
this.app = this.test.getExpress();
	

  describe("OData V4 Service", () => {
    it("returns a JSON payload", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .end((error) => (error) ? done.fail(error) : done());
    });
    
    it("/ redirect works", (done) => {
      request(this.app)
        .get("/")
        .expect(302)
        .expect("Content-Type", "text/plain; charset=utf-8")
        .expect("Location", "/odata/v4/opensap.hana.CatalogService/")
        .end((error) => (error) ? done.fail(error) : done());
    });

    it("/node redirect works", (done) => {
      request(this.app)
        .get("/node")
        .expect(302)
        .expect("Content-Type", "text/plain; charset=utf-8")
        .expect("Location", "/odata/v4/opensap.hana.CatalogService/")
        .end((error) => (error) ? done.fail(error) : done());
    });
    
  });
  
  
});