sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"rab/util/Cookie"
], function (jQuery, Fragment, Controller, JSONModel, MessageToast, Cookie) {
	"use strict";

	var CController = Controller.extend("rab.controller.nmarxController.Kundendetail", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("kundenDetail").attachMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (evt) {
			let c = Cookie.getCookie("kunde");
			if (!c)
				return;
			let data = JSON.parse(c);
			if (data == null) {
				return;
			}

			//Kundendaten in "Meine Einstellungen" werden angezeigt
			let oModel = new JSONModel(data);
			this.getView().setModel(oModel, "Kundendaten");
		},

		onSave: function () {
			console.log("onSave");

			let kDaten = this.getView().getModel("Kundendaten").getData();
			console.log(kDaten);

			Cookie.eraseCookie("kunde");
			Cookie.setCookie("kunde", JSON.stringify(kDaten), 7);

			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("Root", "setLogin");

			MessageToast.show("Änderungen gespeichert");
		},

		onExit: function () {
		}
	});

	return CController;

});

