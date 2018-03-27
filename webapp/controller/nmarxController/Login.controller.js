sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("rab.controller.nmarxController.Login", {
		onInit: function() {

			var oKundenModel = new JSONModel({
				EMail: "",
				Passwort: ""
			});
			this.getView().setModel(oKundenModel, "Kundendaten");
		},

		anmelden: function() {

			let oComponent = this.getOwnerComponent();
			let m = oComponent.getModel("Kundendaten"); //das globale model für Kundendaten
			m.getProperty("/Kunden"); //liste mit den registrierten Kunden holen
			let listeKunden = m.getProperty("/Kunden");
			let user = oComponent.getModel("user");

			//cleared die Anmeldung
			user.setProperty("/EMail", "");

			var kDaten = this.getView().getModel("Kundendaten").getData();
			for (let i in listeKunden) {
				let kunde = listeKunden[i];
				if (kunde.EMail === kDaten.EMail && kunde.Passwort === kDaten.Passwort) {
					user.setProperty("/EMail", kunde.EMail);
					MessageToast.show("Anmeldung war erfolgreich");
				}
				console.log(kDaten);
			}

			if (user.getProperty("/EMail") === "") {
				MessageToast.show("Die Email oder das Passwort ist nicht korrekt");
			}
		}
	});

});