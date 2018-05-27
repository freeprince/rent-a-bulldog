sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"rab/util/Cookie"
], function (Controller, JSONModel, MessageToast, Cookie) {
	"use strict";

	return Controller.extend("rab.controller.nmarxController.Login", {
		onInit: function () {
			this.getView().setModel(new JSONModel({
				EMail: "",
				Passwort: ""
			}), "Kundendaten");
		},

		anmelden: function () {
			let listeKunden = Cookie.getCookie("kundenliste");
			if (listeKunden) {
				listeKunden = JSON.parse(listeKunden);
			} else {
				listeKunden = [];
			}

			let erfolg = false;

			let kDaten = this.getView().getModel("Kundendaten").getData();
			for (let i in listeKunden) {
				let kunde = listeKunden[i];
				if (kunde.EMail === kDaten.EMail && kunde.Passwort === kDaten.Passwort) {					
					erfolg = true;
					break;
				}
			}

			if (erfolg) {
				this.getView().setModel(new JSONModel({
					EMail: "",
					Passwort: ""
				}), "Kundendaten");

				let oComponent = this.getOwnerComponent();
				let m = oComponent.getModel("user");
				m.setProperty("/EMail", kDaten.EMail);
	
				Cookie.eraseCookie("kunde");

				MessageToast.show("Anmeldung war erfolgreich");
				Cookie.setCookie("kunde", JSON.stringify(kDaten), 1);

				var eventBus = sap.ui.getCore().getEventBus();
				eventBus.publish("Root", "login", kDaten);

				let c3 = Cookie.getCookie("bulldog");
				if (c3) {
					eventBus.publish("Root", "navToDetail", null);
				} else {
					eventBus.publish("Root", "navToHome", null);
				}
			}
		}
	});

});