using CatalogService as cats from './my-service';

annotate cats.POItemsView with @( // header-level annotations
// ---------------------------------------------------------------------------
// List Report
// ---------------------------------------------------------------------------
	// Product List
	UI: {
		LineItem: [ 
			{$Type: 'UI.DataField', Value: PO_ITEM_ID, "@UI.Importance":#High},
			{$Type: 'UI.DataField', Value: PRODUCT_ID, "@UI.Importance": #High},
			{$Type: 'UI.DataField', Value: PARTNER_ID, "@UI.Importance": #High},
			{$Type: 'UI.DataField', Value: PARTNERS.COMPANYNAME, "@UI.Importance": #Medium},			
			{$Type: 'UI.DataField', Value: AMOUNT, "@UI.Importance": #High},
			{$Type: 'UI.DataField', Value: CURRENCY_CODE, "@UI.Importance": #Medium},			
 		],
 		PresentationVariant: {
			SortOrder: [ {$Type: 'Common.SortOrderType', Property: PO_ITEM_ID, Descending: false}, {$Type: 'Common.SortOrderType', Property: PRODUCT_ID, Descending: false} ]
		}
	}


);
