
sap.ui.jsview("sap.shineNext.partners.view.Home", {

	getControllerName: function() {
		return "sap.shineNext.partners.controller.Home";
	},
	
	createContent : function(oCon) {
		
		this.page = new sap.m.Page({
			title : "Business Partners",
			content : []
		});
		
		// create list
		this.list = new sap.m.List({
			select : [ oCon.listSelect, oCon ]			
		});
		this.list.bindAggregation("items", {
			path: "/Buyer",
			sorter : new sap.ui.model.Sorter("Id", false),
			template : new sap.m.StandardListItem({
				title : "{CompanyName}",
				description : {
					path : "Id"
				},
				press : [ oCon.itemPress, oCon ],
				type : {
					path : "local>/inEdit",
					formatter : function(inEdit) {
						return (inEdit) ? sap.m.ListType.Inactive : sap.m.ListType.Active;
					}
				}
			})
		});
		
		// create create dialog
		this.inputCreate = sap.ui.xmlview("inputCreate", "view.Input");
		this.createDialog = new sap.m.Dialog({
			title : "New Business Partner",
			stretch: jQuery.device.is.phone,
			content : [
				this.inputCreate
			],
			leftButton : new sap.m.Button({
				text : "Done",
				press : [ oCon.createDialogConfirm, oCon ]
			}),
			rightButton : new sap.m.Button({
				text : "Cancel",
				press : [ oCon.createDialogCancel, oCon ]
			})
		});
		
		// create buttons
		this.createButton = new sap.m.Button({
			icon : "sap-icon://add",
			visible : {
				path : "local>/inEdit",
				formatter : function(inEdit) { return !inEdit; }
			},
			press : [ oCon.createButtonPress, oCon ]
		});
				
		// place buttons depending on the mode
		this.page.addContent(this.list);
		this.page.addHeaderContent(this.createButton);
				
		return this.page;
	}
});