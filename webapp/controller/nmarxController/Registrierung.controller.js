sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"rab/util/Cookie"
], function (Controller, JSONModel, MessageToast, Cookie) {
	"use strict";

	return Controller.extend("rab.controller.nmarxController.Registrierung", {
		onInit: function () {

			// set explored app's demo model on this sample
			var oModel = new JSONModel({
				AnredeCollection: [
					{ text: "Herr" }, 
					{ text: "Frau" }
				]
			});
			this.getView().setModel(oModel, "Anrede");

			this.getView().setModel(new JSONModel({
				Anrede: "",
				Vorname: "",
				Nachname: "",
				Straße: "",
				Hausnummer: "",
				Plz: "",
				Ort: "",
				FSchein: "",
				Geburtsdatum: "",
				EMail: "",
				Passwort: "",
				Passwortbestätigung: ""
			}), "Kundendaten");
		},

		registrieren: function () {
			var kDaten = this.getView().getModel("Kundendaten").getData();
			if (kDaten.EMail == "") {
				MessageToast.show("Bitte E-Mail füllen!");
				return;
			}
			if (kDaten.Passwort != kDaten.Passwortbestätigung) {
				MessageToast.show("Passwörter stimmen nicht überein!");
				return;
			}

			let valueAnrede = this.byId("anrede").getSelectedKey();
			kDaten.Anrede = valueAnrede;

			let liste = Cookie.getCookie("kundenliste")
			if (!liste) {
				liste = [];
			} else {
				liste = JSON.parse(liste);
			}
			liste.push(kDaten);
			Cookie.setCookie("kundenliste", JSON.stringify(liste), 7);

			MessageToast.show("Registrierung war erfolgreich");
			console.log(liste);

			this.getView().setModel(new JSONModel({
				Anrede: "",
				Vorname: "",
				Nachname: "",
				Straße: "",
				Hausnummer: "",
				Plz: "",
				Ort: "",
				FSchein: "",
				Geburtsdatum: "",
				EMail: "",
				Passwort: "",
				Passwortbestätigung: ""
			}), "Kundendaten");
			
			Cookie.setCookie("kunde", JSON.stringify(kDaten), 1);
			
			let oComponent = this.getOwnerComponent();
			let m = oComponent.getModel("user");
			m.setProperty("/EMail", kDaten.EMail);
			m.setProperty("/Vorname", kDaten.Vorname);
			m.setProperty("/Nachname", kDaten.Nachname);

			var eventBus = sap.ui.getCore().getEventBus();
			eventBus.publish("Root", "login", kDaten);
			eventBus.publish("Root", "navToHome", null);
		}

	});

});