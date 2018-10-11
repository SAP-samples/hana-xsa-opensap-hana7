/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0 */
/*eslint-env node, es6 */

function classes() {
	var body = "";

	body += "<b>True Classes</b></p>";
	//Class Literal	
	class color {
		constructor() {
			this.red = "#FF0000";
			this.green = "#00FF00";
			this.blue = "#0000FF";
		}

		favoriteColor() {
			var now = new Date();
			if (now.getDay() === 1) { //If Monday
				return this.blue;
			} else {
				return this.red;
			}
		}
	}
	let colors = new color();
	body += `<span style="color: ${colors.red}">Red</span></p>`;
	body += `<span style="color: ${colors["blue"]}">Blue</span></p>`;
	body += `<span style="color: ${colors.green}">Green</span></p>`;
	body += `<span style="color: ${colors.favoriteColor()}">Favorite Color</span></p>`;

	body += "<b>Class Constructor</b></p>";
	//Class Constructor
	class purchaseOrder {
		constructor(purchaseOrderID) {
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
		}
		discount(){
			return (this.grossAmount - this.grossAmount * ".10");
		}
	}

	var po = new purchaseOrder(300000000);
	body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

	po = new purchaseOrder(300000001);
	body += `Purchase Order: ${po.purchaseOrderID} Gross Amount: ${po.grossAmount} Discount Amount: ${po.discount()} </p>`;

	$.response.status = $.net.http.OK;
	$.response.contentType = "text/html";
	$.response.setBody(body);
}

classes();