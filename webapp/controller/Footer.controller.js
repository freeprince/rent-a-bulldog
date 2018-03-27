sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("rab.controller.Footer", {
		onInit: function() {
		},
		onNavToImpressum: function(oEvent) {
			console.log(oEvent);
			this.onNavTo("impressum");
		},
		onNavToContact: function(oEvent) {
			this.onNavTo("contact");
		},
		onNavToCompany: function(oEvent) {
			this.onNavTo("company");
		},
		onNavToFaq: function(oEvent) {
			this.onNavTo("faq");
		},
		onNavTo: function(target) {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(target);
		}
	});
});