sap.ui.controller("sap.openSAP.smarttable.view.SmartTable", {
	onInit: function() {
		var oModel = this.getOwnerComponent().getModel();
		oModel.metadataLoaded().then(function() {
			var oMetadata = oModel.getServiceMetadata(); //.dataServices.schema[0].entityType
			console.log(oMetadata);

			for (var i = 0; i < oMetadata.dataServices.schema[0].entityType.length; i++) {
				for (var inner = 0; inner < oMetadata.dataServices.schema[0].entityType[i].property.length; inner++) {
					
					oMetadata.dataServices.schema[0].entityType[i].property[inner].extensions[0].value += " Upd"; 
					oMetadata.dataServices.schema[0].entityType[i].property[inner].extensions.push({
						name: "quickinfo",
						namespace: "http://www.sap.com/Protocols/SAPData",
						value: "Add QuickInfo"
					});
				}
			}
			
			var oMetadata2 = oModel.getServiceMetadata(); //.dataServices.schema[0].entityType
			console.log(oMetadata2);
		});

		var oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
		var oMessageManager = sap.ui.getCore().getMessageManager();

		oMessageManager.registerMessageProcessor(oMessageProcessor);

		oMessageManager.addMessages(
			new sap.ui.core.message.Message({
				message: "Welcome to the SmartTable Example",
				type: sap.ui.core.MessageType.Information,
				processor: oMessageProcessor
			})
		);

	},

	onSemanticEmailPress: function(oEvent) {

		var sAction = oEvent.getSource().getMetadata().getName();
		sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

		sap.m.MessageToast.show("Pressed: " + sAction);
	},

	onSemanticJamPress: function(oEvent) {
		var sAction = oEvent.getSource().getMetadata().getName();
		sAction = sAction.replace(oEvent.getSource().getMetadata().getLibraryName() + ".", "");

		sap.m.MessageToast.show("Pressed: " + sAction);
	},

	onNavButtonPress: function() {
		sap.m.MessageToast.show("Pressed navigation button");
	},

	onMessagesButtonPress: function(oEvent) {

		var oMessagesButton = oEvent.getSource();
		if (!this._messagePopover) {
			this._messagePopover = new sap.m.MessagePopover({
				items: {
					path: "message>/",
					template: new sap.m.MessagePopoverItem({
						description: "{message>description}",
						type: "{message>type}",
						title: "{message>message}"
					})
				}
			});
			oMessagesButton.addDependent(this._messagePopover);
		}
		this._messagePopover.toggle(oMessagesButton);
	}

});