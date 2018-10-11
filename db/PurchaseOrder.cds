namespace opensap.PurchaseOrder;
using BUYER from '../db/import';
    type BusinessKey : String(10);
    type SDate : DateTime;
    type CurrencyT : String(5) @title: '{i18n>currency}';
    type AmountT : Decimal(15, 2);
    type QuantityT : Decimal(13, 3) @(title: '{i18n>quantity}', Measures.Unit: Units.Quantity );
    type UnitT : String(3) @title: '{i18n>quantityUnit}';
    type StatusT : String(1);

	type HistoryT {
        CREATEDBY : BusinessKey @(title: '{i18n>CreatedBy}', Common.FieldControl: #ReadOnly);
        CREATEDAT : SDate  @(title: '{i18n>CreatedAt}',  Common.FieldControl: #ReadOnly);
        CHANGEDBY : BusinessKey  @(title: '{i18n>ChangedBy}',  Common.FieldControl: #ReadOnly);
        CHANGEDAT : SDate  @(title: '{i18n>ChangedAt}',  Common.FieldControl: #ReadOnly);
    };

    entity Headers {
        key PURCHASEORDERID : Integer @(title: '{i18n>po_id}', Common.FieldControl: #Mandatory, Search.defaultSearchElement, Common.Label: '{i18n>po_id}');
            ITEMS           : association to many Items on ITEMS.POHeader = $self @(title: '{i18n>po_items}', Common: { Text: {$value: ITEMS.PRODUCT, "@UI.TextArrangement": #TextOnly }});
            HISTORY         : HistoryT;
            NOTEID          : BusinessKey null @title: '{i18n>notes}';
            PARTNER         : BusinessKey @title: '{i18n>partner_id}';
            CURRENCY        : CurrencyT @(
            	Common: {
					Text: {$value: CURRENCY.CURRENCY, "@UI.TextArrangement": #TextOnly},
					ValueList: {entity: 'CURRENCY', type: #fixed},
					ValueListWithFixedValues
				}
			);
            GROSSAMOUNT     : AmountT @( title: '{i18n>grossAmount}', Measures.ISOCurrency: currency);
            NETAMOUNT       : AmountT @( title: '{i18n>netAmount}', Measures.ISOCurrency: currency);
            TAXAMOUNT       : AmountT @( title: '{i18n>taxAmount}', Measures.ISOCurrency: currency);
            LIFECYCLESTATUS : StatusT @(title: '{i18n>lifecycle}', Common.FieldControl: #ReadOnly);
            APPROVALSTATUS  : StatusT @(title: '{i18n>approval}', Common.FieldControl: #ReadOnly);
            CONFIRMSTATUS   : StatusT @(title: '{i18n>confirmation}', Common.FieldControl: #ReadOnly);
            ORDERINGSTATUS  : StatusT @(title: '{i18n>ordering}', Common.FieldControl: #ReadOnly);
            INVOICINGSTATUS : StatusT @(title: '{i18n>invoicing}', Common.FieldControl: #ReadOnly);
    }


    entity Items {
        key POHeader     : association to Headers @title: '{i18n>poService}';
        key PRODUCT      : BusinessKey @(title: '{i18n>product}', Common.FieldControl: #Mandatory, Search.defaultSearchElement);
            NOTEID       : BusinessKey null ;
            CURRENCY     : CurrencyT @(
            	Common: {
					Text: {$value: CURRENCY.CURRENCY, "@UI.TextArrangement": #TextOnly},
					ValueList: {entity: 'CURRENCY', type: #fixed},
					ValueListWithFixedValues
				}
			);
            GROSSAMOUNT  : AmountT @( title: '{i18n>grossAmount}', Measures.ISOCurrency: currency);
            NETAMOUNT    : AmountT  @( title: '{i18n>netAmount}', Measures.ISOCurrency: currency);
            TAXAMOUNT    : AmountT @( title: '{i18n>taxAmount}', Measures.ISOCurrency: currency);
            QUANTITY     : QuantityT;
            QUANTITYUNIT : UnitT;
            DELIVERYDATE : SDate @title: '{i18n>deliveryDate}';
    }

	define view ItemView as
        select from Items
        {
            POHeader.PURCHASEORDERID,
            POHeader.PARTNER,
            PRODUCT,
            CURRENCY,
            GROSSAMOUNT,
            NETAMOUNT,
            TAXAMOUNT,
            QUANTITY,
            QUANTITYUNIT,
            DELIVERYDATE
        };


