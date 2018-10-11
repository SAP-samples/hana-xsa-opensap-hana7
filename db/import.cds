    type BusinessKey : String(10);
type SDate : DateTime;
type CurrencyT : String(5)  @title: '{i18n>currency}';
type AmountT : Decimal(15, 2);
type QuantityT : Decimal(13, 3) @(title: '{i18n>quantity}', Measures.Unit: Units.Quantity );
type UnitT : String(3) @title: '{i18n>quantityUnit}';
type StatusT : String(1);
    

@cds.persistence.exists
entity PURCHASE_ORDER_ITEM_VIEW {
  key PO_ITEM_ID: Integer @(title: '{i18n>po_items}', Common: { Text: {$value: PRODUCT_ID, "@UI.TextArrangement": #TextOnly }});
  PARTNER_ID: BusinessKey @title: '{i18n>partner_id}';
  key PRODUCT_ID: BusinessKey @(title: '{i18n>product}', Common.FieldControl: #Mandatory, Search.defaultSearchElement);
  CURRENCY_CODE: CurrencyT @(
            	Common: {
					Text: {$value: CURRENCY.CURRENCY, "@UI.TextArrangement": #TextOnly},
					ValueList: {entity: 'CURRENCY', type: #fixed},
					ValueListWithFixedValues
				}
			);
  AMOUNT: AmountT @( title: '{i18n>grossAmount}', Measures.ISOCurrency: currency);
  NET_AMOUNT: AmountT @( title: '{i18n>netAmount}', Measures.ISOCurrency: currency);
  TAX_AMOUNT: AmountT @( title: '{i18n>taxAmount}', Measures.ISOCurrency: currency);
  QUANTITY: QuantityT;
  QUANTITY_UNIT: UnitT;
  DELIVERY_DATE: SDate @title: '{i18n>deliveryDate}';
}

@cds.persistence.exists 
Entity BUYER {
 	BUILDING: String(10) @title: '{i18n>building}'; 
	CITY: String(40) @title: '{i18n>city}'; 
	COMPANYNAME: String(80) @title: '{i18n>company}'; 
	COUNTRY: String(3) @title: '{i18n>country}'; 
	EMAILADDRESS: String(255) @title: '{i18n>email}'; 
	LEGALFORM: String(10) @title: '{i18n>legal}';  
	key PARTNERID: Integer @title: '{i18n>partnerId}'; 
	PARTNERROLE: String(3) @title: '{i18n>partnerRole}';  
	POSTALCODE: String(10) @title: '{i18n>postalCode}';  
	REGION: String(4) @title: '{i18n>region}';  
	STREET: String(60)  @title: '{i18n>street}';  
}

@cds.persistence.exists 
Entity USER_DETAILS {
	 EMAIL: String(255)  @title: '{i18n>email}';  
	 FIRSTNAME: String(40) @title: '{i18n>fname}';
	 LASTNAME: String(40) @title: '{i18n>lname}';
     key USERID: Integer @title: '{i18n>userId}';	 
}

@cds.persistence.exists 
Entity CURRENCY {
	 key CODE: String(3) @title: '{i18n>currCode}';
	 CURRENCY: String(80) @title: '{i18n>currDesc}';
}