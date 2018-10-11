using opensap.PurchaseOrder.Headers as Headers from '../db/data-model';
using opensap.PurchaseOrder.Items as Items from '../db/data-model';
using PURCHASE_ORDER_ITEM_VIEW as ItemsView from '../db/data-model';
using BUYER as BuyerView from '../db/data-model';
using USER_DETAILS as UserDetails from '../db/data-model';
using CURRENCY as Curr from '../db/data-model';
//using Headers as Headers from '../db/PurchaseOrder';

// [ADDING EXTERNAL SERVICE] To add entities from external services:
// [ADDING EXTERNAL SERVICE] - STEP 1 - Add a data model from an external service to the project (by selecting the relevant menu option in SAP Web IDE).
// [ADDING EXTERNAL SERVICE] - STEP 2 - Add a reference to the external service model file:
// using <external_service_name> as <alias_name> from '../srv/external/csn/<external_service_name>';

service CatalogService {

	entity MyEntity {
	    key ID : Integer;
	}
	

entity POs @(
		title: '{i18n>poService}',
		Capabilities: {
			InsertRestrictions: {Insertable: true},
			UpdateRestrictions: {Updatable: true},
			DeleteRestrictions: {Deletable: true}
		}
	) as projection on Headers;

entity POItems @(
		title: '{i18n>poService}',
		Capabilities: {
			InsertRestrictions: {Insertable: true},
			UpdateRestrictions: {Updatable: true},
			DeleteRestrictions: {Deletable: true}
		}
	) as projection on Items;

extend ItemsView with {
	PARTNERS: association to BuyerView on PARTNERS.PARTNERID = PARTNER_ID;
}
entity POItemsView @(
		title: '{i18n>poService}',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on ItemsView;

entity Buyer @(
		title: '{i18n>buyerService}',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on BuyerView;

entity User @(
		title: '{i18n>userService}',
		Capabilities: {
			InsertRestrictions: {Insertable: true},
			UpdateRestrictions: {Updatable: true},
			DeleteRestrictions: {Deletable: true}
		}
	) as projection on UserDetails;

entity CURRENCY @(
		title: '{i18n>currencySrvice}',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on Curr;
	
//entity POsFromHANA as projection on PO.PURCHASE_ORDER_ITEM_VIEW;

	// [ADDING EXTERNAL SERVICE] - STEP 3 - Add a new entity to the exposed service model:
	// @cds.persistence.skip
	// entity <entity_name> as projection on <alias_name>.<external_entity_name>;

}
