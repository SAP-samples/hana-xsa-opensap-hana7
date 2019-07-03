using opensap.PurchaseOrder.Headers as Headers from '../db/data-model';
using opensap.PurchaseOrder.Items as Items from '../db/data-model';
using PURCHASE_ORDER_ITEM_VIEW as ItemsView from '../db/data-model';
using BUYER as BuyerView from '../db/data-model';
using USER_DETAILS as UserDetails from '../db/data-model';
using CURRENCY as Curr from '../db/data-model';

service CatalogService {

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
}