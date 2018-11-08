/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {

	this.base = __dirname + "/";
	this.test = require("../../utils/tests");
	this.results = [{
		"VIEW_NAME": "MDViews.BPAddrExt"
	}, {
		"VIEW_NAME": "MDViews.BPOrders2View"
	}, {
		"VIEW_NAME": "MDViews.BPOrders3View"
	}, {
		"VIEW_NAME": "MDViews.BPOrdersView"
	}, {
		"VIEW_NAME": "MDViews.BPView"
	}, {
		"VIEW_NAME": "MDViews.BuyerView"
	}, {
		"VIEW_NAME": "MDViews.NewYorkEmployees"
	}, {
		"VIEW_NAME": "MDViews.ProductValuesView"
	}, {
		"VIEW_NAME": "MDViews.ProductView"
	}, {
		"VIEW_NAME": "MDViews.ProductViewSub"
	}, {
		"VIEW_NAME": "MDViews.ProductsConsumption"
	}, {
		"VIEW_NAME": "MDViews.SupplierView"
	}, {
		"VIEW_NAME": "MDViews.SupplierViewVH"
	}, {
		"VIEW_NAME": "MDViews.productCategoryVH"
	}, {
		"VIEW_NAME": "MDViews.productTexts"
	}, {
		"VIEW_NAME": "MDViews.texts"
	}, {
		"VIEW_NAME": "OPENSAP_PURCHASEORDER_ITEMVIEW"
	}, {
		"VIEW_NAME": "PO.HeaderView"
	}, {
		"VIEW_NAME": "PO.ItemView"
	}, {
		"VIEW_NAME": "PO.POView"
	}, {
		"VIEW_NAME": "PO.POWorklistView"
	}, {
		"VIEW_NAME": "PURCHASE_ORDER_ITEM_VIEW"
	}, {
		"VIEW_NAME": "PurchaseOrder.ItemView"
	}, {
		"VIEW_NAME": "PurchaseOrders"
	}, {
		"VIEW_NAME": "SO.addressView"
	}, {
		"VIEW_NAME": "SO.salesOrderView"
	}, {
		"VIEW_NAME": "SflightExt"
	}, {
		"VIEW_NAME": "Util.AttachementsView"
	}, {
		"VIEW_NAME": "Util.NotesView"
	}, {
		"VIEW_NAME": "Util.textsView"
	}, {
		"VIEW_NAME": "dcl_aspect.aspCountry"
	}, {
		"VIEW_NAME": "core.models::BUYER"
	}, {
		"VIEW_NAME": "core.models::GET_COUNTRIES"
	}, {
		"VIEW_NAME": "core.models::GET_PARTNER_ROLES"
	}, {
		"VIEW_NAME": "core.models::POExpanded"
	}, {
		"VIEW_NAME": "core.models::PO_BASIC"
	}, {
		"VIEW_NAME": "core.models::PO_HEADER_EN"
	}, {
		"VIEW_NAME": "core.models::PO_HEADER_ONLY"
	}, {
		"VIEW_NAME": "core.models::PO_ITEM"
	}, {
		"VIEW_NAME": "core.models::PROD"
	}, {
		"VIEW_NAME": "core.models::PRODUCT"
	}, {
		"VIEW_NAME": "core.models::PRODUCTS"
	}, {
		"VIEW_NAME": "core.models::PURCHASE_COMMON_CURRENCY"
	}, {
		"VIEW_NAME": "core.models::PURCHASE_DETAILS"
	}, {
		"VIEW_NAME": "core.models::PURCHASE_ORDERS"
	}, {
		"VIEW_NAME": "core.models::SALESORDER_BASKET_ANALYSIS"
	}, {
		"VIEW_NAME": "core.models::SALES_DETAILS"
	}, {
		"VIEW_NAME": "core.models::SALES_ORDER_HEADER_W_BUYER"
	}, {
		"VIEW_NAME": "core.models::SALES_ORDER_WORKLIST"
	}, {
		"VIEW_NAME": "core.models::SALES_OVERVIEW_WO_CURR_CONV_OPT"
	}, {
		"VIEW_NAME": "core.models::SUPPLIER"
	}, {
		"VIEW_NAME": "spatial.models::BP_ADDRESS_DETAILS"
	}, {
		"VIEW_NAME": "spatial.models::REGION_PRODUCT"
	}, {
		"VIEW_NAME": "spatial.models::REGION_SALES_BP"
	}];

	this.results.forEach(async(test) => {
		it(`View Test: ${test.VIEW_NAME}`, async(done) => {
			try {
				let db = await this.test.getDBClass(await this.test.getClient());
				let sql = `SELECT * FROM "${test.VIEW_NAME}"`;
				let statement = await db.preparePromisified(sql);
				let results = await db.statementExecPromisified(statement, []);
				expect(results.length).not.toBeLessThan(1, `View Name: ${test.VIEW_NAME}`);
				done();
			} catch (err) {
				done.fail(err);
			}
		});
	});

});