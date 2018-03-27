sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("rab.controller.Root", {
		onInit: function() {
			
		},
		onHeaderPressed: function() {						
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("");
		}
	});
});