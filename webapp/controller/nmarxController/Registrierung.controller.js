sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"rab/util/Cookie"
], function (Controller, JSONModel, MessageToast, Cookie) {
	"use strict";

	return Controller.extend("rab.controller.nmarxController.Registrierung", {
		onInit: function () {
			this.getView().setModel(new JSONModel({
				EMAIL: "",
				FNR: "",
				GEBURTSDATUM: null,
				NACHNAME: "",
				ORT: "",
				PASSWORT: "",
				PLZ: "",
				STRASSE: "",
				TELEFON: "",
				VORNAME: "",
				ausstell_datum: "",
				ftyp: "a",
				Passwortbestätigung: ""
			}), "Kundendaten");
		},

		registrieren: function () {
			let that = this;

			var kDaten = this.getView().getModel("Kundendaten").getData();
			if (kDaten.EMAIL == "") {
				MessageToast.show("Bitte E-Mail füllen!");
				return;
			}
			if (kDaten.PASSWORT != kDaten.Passwortbestätigung) {
				MessageToast.show("Passwörter stimmen nicht überein!");
				return;
			}

			let oEntry = kDaten;

			if (oEntry.GEBURTSDATUM != null) {
				let dateParts = oEntry.GEBURTSDATUM.split(".");
				let date = new Date(dateParts[2], (parseInt(dateParts[1])-1), dateParts[0], 12);				
				oEntry.GEBURTSDATUM = date;
			} else 
				oEntry.GEBURTSDATUM = null;

			if (oEntry.ausstell_datum != null) {
				let dateParts = oEntry.ausstell_datum.split(".");
				let date = new Date(dateParts[2], (parseInt(dateParts[1])-1), dateParts[0], 12);
				oEntry.ausstell_datum = date;
			} else
				oEntry.ausstell_datum = null;

			oEntry.FNR = parseInt(oEntry.FNR);
			oEntry.PLZ = parseInt(oEntry.PLZ);
			oEntry.KUNDE_ID = 0;
			delete oEntry["Passwortbestätigung"];

			let oServiceKunde = this.getOwnerComponent().getModel("serviceKunde");
			oServiceKunde.create("/ZANA_KUNDE",
				oEntry,
				{
					method: "POST",
					success: function (oRetrievedResult) {

						MessageToast.show("Registrierung war erfolgreich");

						that.getView().setModel(new JSONModel({
							EMAIL: "",
							FNR: "",
							GEBURTSDATUM: null,
							NACHNAME: "",
							ORT: "",
							PASSWORT: "",
							PLZ: "",
							STRASSE: "",
							TELEFON: "",
							VORNAME: "",
							ausstell_datum: "",
							ftyp: "a",
							Passwortbestätigung: ""
						}), "Kundendaten");

						Cookie.setCookie("kunde", JSON.stringify(kDaten), 1);

						let m = that.getOwnerComponent().getModel("user");;
						m.setProperty("/EMail", kDaten.EMAIL);
						m.setProperty("/Vorname", kDaten.VORNAME);
						m.setProperty("/Nachname", kDaten.NACHNAME);

						var eventBus = sap.ui.getCore().getEventBus();
						eventBus.publish("Root", "login", kDaten);
						eventBus.publish("Root", "navToHome", null);
					},
					error: function (oError) {
						console.log("Login error");
						console.log(oError);
						let responseText = JSON.parse(oError.responseText);
						console.log(responseText);
						let msg = responseText.error.message.value;
						MessageToast.show(msg);
						console.log(msg);
					}
				});
		}

	});

});