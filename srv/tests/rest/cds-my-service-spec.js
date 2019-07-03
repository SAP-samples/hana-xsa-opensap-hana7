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
   
    it("$metadata", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/$metadata")
        .expect(200)
        .expect("Content-Type", "application/xml")
        .end((error) => (error) ? done.fail(error) : done());
    });

    it("MyEntity Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/MyEntity")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).toBe(0);
        })
        .end((error) => (error) ? done.fail(error) : done());
    });

    it("POs Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/POs")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).not.toBeLessThan(2);
        	expect(res.body.value[0].PURCHASEORDERID).toBe(500000000);
        	expect(res.body.value[1].PURCHASEORDERID).toBe(500000001);        	
        })
        .end((error) => (error) ? done.fail(error) : done());
    });
 
     it("POItems Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/POItems")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).not.toBeLessThan(20);
        	expect(res.body.value[0].POHeader_PURCHASEORDERID).toBe(500000000);
        	expect(res.body.value[1].PRODUCT).toBe("HT-1091");        	
        })
        .end((error) => (error) ? done.fail(error) : done());
    });

 
     it("POItemsView Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/POItemsView")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).not.toBeLessThan(20);
        	expect(res.body.value[0].PO_ITEM_ID).toBe(500000000);
        	expect(res.body.value[1].PRODUCT_ID).toBe("HT-1091");        	
        })
        .end((error) => (error) ? done.fail(error) : done());
    });

     it("Buyer Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/Buyer")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).not.toBeLessThan(45);
        	expect(res.body.value[0].PARTNERID).toBe(100000000);
        	expect(res.body.value[1].COMPANYNAME).toBe("Becker Berlin");        	
        })
        .end((error) => (error) ? done.fail(error) : done());
    });

     it("User Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/User")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .end((error) => (error) ? done.fail(error) : done());
    });

     it("CURRENCY Entity", (done) => {
      request(this.app)
        .get("/odata/v4/opensap.hana.CatalogService/CURRENCY")
        .expect(200)
        .expect("Content-Type", "application/json;odata.metadata=minimal")
        .expect((res)=>{
        	expect(res.body.value.length).not.toBeLessThan(308);
        	expect(res.body.value[0].CODE).toBe("NUL");
        	expect(res.body.value[1].CURRENCY).toBe("Andorran Peseta");        	
        })
        .end((error) => (error) ? done.fail(error) : done());
    });
    
  });

});