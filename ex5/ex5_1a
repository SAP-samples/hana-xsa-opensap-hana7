using opensap.PurchaseOrder.Headers as Headers from '../db/data-model';
using opensap.PurchaseOrder.Items as Items from '../db/data-model';

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

}
