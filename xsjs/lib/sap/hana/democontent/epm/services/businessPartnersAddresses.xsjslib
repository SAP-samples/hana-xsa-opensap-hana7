$.import("sap.hana.democontent.epm.services", "session");
var SESSIONINFO = $.sap.hana.democontent.epm.services.session;

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
@param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
 */

function bp_create_before_exit(param) {

	var	after = param.afterTableName;
	var pStmt;
	try {

		pStmt = param.connection.prepareStatement('select "businessPartnerId".NEXTVAL from DUMMY');
		var rs = pStmt.executeQuery();
		var PartnerId = '';
		while (rs.next()) {
			PartnerId = rs.getInteger(1);
		}
		pStmt.close();

		pStmt = param.connection.prepareStatement('update "' + after
				+ '" set PARTNERID = ?,' + 
				  '  PARTNERROLE = ?, ' +
				  '  "HISTORY.CREATEDBY.EMPLOYEEID" = ?,' +
				  '  "HISTORY.CHANGEDBY.EMPLOYEEID" = ?,' +
				  '  "HISTORY.CREATEDAT" = now(),' + 
				  '  "HISTORY.CHANGEDAT" = now(),' + 
				  '  "CURRENCY" = ?');
		pStmt.setInteger(1, PartnerId);	
		pStmt.setString(2, '01');	
		pStmt.setInteger(3, 33);
		pStmt.setInteger(4, 33);
		pStmt.setString(5, 'EUR');		
		
		pStmt.execute();
		pStmt.close();

		
	}
	catch (e) {
		console.log(e.toString());
		return;
	}

}

function address_create_before_exit(param) {

	var	after = param.afterTableName;
	
	var pStmt;
	try {
		
	pStmt = param.connection.prepareStatement('select "addressId".NEXTVAL from dummy');
	var rs = pStmt.executeQuery();
	var AddressId = '';
	while (rs.next()) {
		AddressId = rs.getInterger(1);
	}
	pStmt.close();

	pStmt = param.connection.prepareStatement('update "' + after
			+ '" set "ADDRESSID" = ?,' +
			  'ADDRESSTYPE = ?,' +
			  '"VALIDITY.STARTDATE" = TO_DATE(' + "'2000-01-01', 'YYYY-MM-DD'),"  +
			  '"VALIDITY.ENDDATE" = TO_DATE(' + "'9999-12-31', 'YYYY-MM-DD')" );
	pStmt.setInteger(1, AddressId);		
	pStmt.setString(2, '02');			
	pStmt.execute();
	pStmt.close();
		
	}
	catch (e) {
		console.log(e.toString());
		return;
	}

}

/**
@param {connection} Connection - The SQL connection used in the OData request
@param {principalTableName} String - The name of a temporary table with the entity type at the principal end of the association
@param {dependentTableName} String -The name of a temporary table with the dependent entity type
 */


function assocation_create_exit(param){
	var	princ = param.principalTableName;
	var	dep = param.dependentTableName;


	var	pStmt = param.connection.prepareStatement('select * from "' + princ + '"');
	var Principal = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), 'Details');
	pStmt.close();
	
	var	pStmt = param.connection.prepareStatement('select * from "' + dep + '"');
	var Dependent = SESSIONINFO.recordSetToJSON(pStmt.executeQuery(), 'Details');
	pStmt.close();	
	
	$.trace.debug(JSON.stringify(Principal));
	$.trace.debug(JSON.stringify(Dependent));
	var pStmt = param.connection.prepareStatement('update "MD.BusinessPartner" ' +
			    ' SET "ADDRESSES.ADDRESSID" = ? WHERE "PARTNERID" = ? ');
	pStmt.setInteger(1, Dependent.Details[0].ADDRESSID);
	pStmt.setInteger(2, Principal.Details[0].PARTNERID);		
	pStmt.execute();
	pStmt.close();	
			
}

function metadata(param){
//	 var result = processXML(param.metadata, function(name, atts) {
//	        var EDM = "http://schemas.microsoft.com/ado/2008/09/edm";
//	        var SAP = "http://www.sap.com/Protocols/SAPData";
//	        var newAtts = {};
//	        if (name === EDM + ":Property" && atts.Name === "M1") {
//	            newAtts[SAP + ":label"] = "The Measure";
//	        }
//	        return newAtts;
//	    });
	    return {metadata: param.metadata};
}