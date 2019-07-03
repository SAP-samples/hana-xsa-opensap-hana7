function validateEmail(email) {
	var re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function bpCreateBusinessPartner(param, partnerRole) {
	var afterTable = param.afterTableName;
	//Get Input New Record Values
	var pStmt = param.connection.prepareStatement("select * from \"" + afterTable + "\"");
	var rs = pStmt.executeQuery();
	var EmailAddress, CompanyName, City, Country, Region;
	while (rs.next()) {
		EmailAddress = rs.getString(2);
		CompanyName = rs.getString(3);
		City = rs.getString(4);
		Country = rs.getString(8);
		Region = rs.getString(9);
	}
	pStmt.close();
	//Validate Email
	if (!validateEmail(EmailAddress)) {
		throw "Invalid email for company " + CompanyName +
			" No Way! E-Mail must be valid and " + EmailAddress + " has problems";
	}

	//insert addresss
	try {
		pStmt = param.connection.prepareStatement("INSERT INTO \"MD.Addresses\" " +
			" (ADDRESSTYPE, CITY, COUNTRY, REGION, \"VALIDITY.STARTDATE\", \"VALIDITY.ENDDATE\") " +
			" VALUES(?,?,?,?, TO_DATE('2000-01-01', 'YYYY-MM-DD'), TO_DATE('9999-12-31', 'YYYY-MM-DD') )");
		pStmt.setString(1, "02");
		pStmt.setString(2, City);
		pStmt.setString(3, Country);
		pStmt.setString(4, Region);

		pStmt.execute();

		pStmt = param.connection.prepareStatement("select CURRENT_IDENTITY_VALUE() from dummy");
		rs = pStmt.executeQuery();
		var AddressId = null;
		while (rs.next()) {
			AddressId = rs.getInteger(1);
		}

		pStmt.close();

	} catch (e) {
		console.error(e);
		throw e;
	}

	//Business Partner
	try {

		pStmt = param.connection.prepareStatement("INSERT INTO  \"MD.BusinessPartner\" " +
			" (PARTNERROLE, \"HISTORY.CREATEDAT\", \"HISTORY.CHANGEDAT\", \"ADDRESSES.ADDRESSID\", EMAILADDRESS, COMPANYNAME  ) " +
			" values(?, now(), now(), ?, ?, ?)");
		pStmt.setString(1, partnerRole);
		pStmt.setInteger(2, AddressId);
		pStmt.setString(3, EmailAddress);
		pStmt.setString(4, CompanyName);
		pStmt.execute();
		pStmt.close();

	} catch (e) {
		console.error(e);
		throw e;
	}

}

function bpCreateBuyer(param) {
	bpCreateBusinessPartner(param, "1");
}

function bpCreateSupplier(param) {
	bpCreateBusinessPartner(param, "2");
}