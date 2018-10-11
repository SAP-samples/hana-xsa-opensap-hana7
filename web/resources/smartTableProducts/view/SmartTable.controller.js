sap.ui.controller("sap.openSAP.smarttableProducts.view.SmartTable", {
	onInit: function() {
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