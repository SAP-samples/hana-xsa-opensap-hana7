/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0 */
/*eslint-env node, es6 */

function objectsBasic() {
	var body = "";

	body += "<b>Object Literals</b></p>";
	//Object Literal	
	var colors = {
		red: "#FF0000",
		green: "#00FF00",
		blue: "#0000FF",
		favoriteColor: () => {
			var now = new Date();
			if (now.getDay() === 1) { //If Monday
				return this.blue;
			} else {
				return this.red;
			}
		}
	};

	body += `<span style="color: ${colors.red}">Red</span></p>`;
	body += `<span style="color: ${colors["blue"]}">Blue</span></p>`;
	body += `<span style="color: ${colors.green}">Green</span></p>`;
	body += `<span style="color: ${colors.favoriteColor()}">Favorite Color</span></p>`;

	body += "<b>References</b></p>";
	//References 
	//regular data types are assigned by value	
	var value1 = "First Value";
	var value2 = value1;
	value1 = "New Value";
	body += `Value 1: ${value1} </p>`; // = First Value
	body += `Value 2: ${value2} </p>`; // = New Value

	//objects are assigned by reference
	var value3 = {
		val: "First Value"
	};
	var value4 = value3;
	value3.val = "New Value";
	body += `Value 3: ${value3.val} </p>`; // = New Value
	body += `Value 4: ${value4.val} </p>`; // = New Value 	

	body += "<b>Object Constructor</b></p>";
	//Object Constructor
	function purchaseOrder(purchaseOrderID) {
		var conn = $.db.getConnection();
		var pstmt;
		var rs;
		var query;

		query = `SELECT * 
		           FROM "PO.Header" 
		          WHERE PURCHASEORDERID = ?`;
		pstmt = conn.prepareStatement(query);
		pstmt.setInteger(1, purchaseOrderID);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			this.purchaseOrderID = rs.getInteger(1);
			this.grossAmount = rs.getDecimal(9);
		}

		rs.close();
		pstmt.close();

		this.discount = function() {
			return (this.grossAmount - this.grossAmount * ".10");
		};

	}

	var po = new purchaseOrder(300000000);
	body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

	po = new purchaseOrder(300000001);
	body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";
	$.response.setBody(body);
}

objectsBasic();