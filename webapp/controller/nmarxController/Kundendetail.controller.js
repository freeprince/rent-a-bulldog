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
			var oModel = new JSONModel({
				AnredeCollection: [
					{ text: "Herr" },
					{ text: "Frau" }
				]
			});
			this.getView().setModel(oModel, "Anrede");
			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		},

		handleRouteMatched: function (evt) {
			let c = Cookie.getCookie("kunde");
			let data = JSON.parse(c);
			if (data == null) {
				return;
			}

			let c2 = Cookie.getCookie("kundenliste");
			let kundenliste = JSON.parse(c2);
			for (let i in kundenliste) {
				let kunde = kundenliste[i];
				if (kunde.EMail == data.EMail) {
					data = kunde;
					break;
				}
			}

			let oModel = new JSONModel(data);
			this.getView().setModel(oModel, "Kundendaten");
		},

		onSave: function () {
			console.log("onSave");

			let kDaten = this.getView().getModel("Kundendaten").getData();
			console.log(kDaten);

			let valueAnrede = this.byId("anrede").getSelectedKey();
			kDaten.Anrede = valueAnrede;

			Cookie.eraseCookie("kunde");
			Cookie.setCookie("kunde", JSON.stringify(kDaten), 7);

			let c2 = Cookie.getCookie("kundenliste");
			let kundenliste = JSON.parse(c2);
			
			let neueListe = [];
			for (let i in kundenliste) {
				let kunde = kundenliste[i];
				if (kunde.EMail == kDaten.EMail) {
					neueListe.push(kDaten);
				} else {
					neueListe.push(kunde);
				}
			}
			kundenliste = neueListe;

			Cookie.setCookie("kundenliste", JSON.stringify(kundenliste), 7);
			
			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("Root", "setLogin");

			MessageToast.show("Änderungen gespeichert");
		},

		onExit: function () {
		}
	});


	return CController;

});