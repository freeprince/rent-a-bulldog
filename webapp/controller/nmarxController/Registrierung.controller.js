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

			//hier werden die obigen Daten in JSONFormat geholt
			var kDaten = this.getView().getModel("Kundendaten").getData();
			if (kDaten.EMAIL == "") {
				MessageToast.show("Bitte E-Mail füllen!");
				return;
			}
			//prüfen ob Passwort mit Passwortbestätigung übereinstimmt
			if (kDaten.PASSWORT != kDaten.Passwortbestätigung) {
				MessageToast.show("Passwörter stimmen nicht überein!");
				return;
			}
			//Eintrag für den Webservice vorbereitet
			let oEntry = kDaten;

			//String in Datumsobjekt umwandeln
			if (oEntry.GEBURTSDATUM != null) {
				let dateParts = oEntry.GEBURTSDATUM.split(".");
				//[2]=Jahr [1]=Monat [0]=Tag und die 12 = Stunden, weil sonst wird immer ein Tag vorher angezeigt
				let date = new Date(dateParts[2], (parseInt(dateParts[1]) - 1), dateParts[0], 12);
				oEntry.GEBURTSDATUM = date;
			} else
				oEntry.GEBURTSDATUM = null;

			if (oEntry.ausstell_datum != null) {
				let dateParts = oEntry.ausstell_datum.split(".");
				let date = new Date(dateParts[2], (parseInt(dateParts[1]) - 1), dateParts[0], 12);
				oEntry.ausstell_datum = date;
			} else
				oEntry.ausstell_datum = null;

			//hier wird die Führerscheinnr und PLZ geparset, sonst kommt Fehlermeldung
			oEntry.FNR = parseInt(oEntry.FNR);
			oEntry.PLZ = parseInt(oEntry.PLZ);
			oEntry.KUNDE_ID = 0;
			delete oEntry["Passwortbestätigung"];

			//Objekt vom Webservice für Kunden 
			let oServiceKunde = this.getOwnerComponent().getModel("serviceKunde");
			oServiceKunde.create("/ZANA_KUNDE",
				oEntry,
				{
					method: "POST",
					success: function (oRueckgabeWebservice) {

						MessageToast.show("Registrierung war erfolgreich");

						//Model wird initialiesiert / gecleart
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
							ftyp: "",
							Passwortbestätigung: ""
						}), "Kundendaten");

						//Kunde wird gemerkt über Cookie
						Cookie.setCookie("kunde", JSON.stringify(kDaten), 1);

						//der registrierte User wird global gesetzt/angezeigt
						let m = that.getOwnerComponent().getModel("user");;
						m.setProperty("/EMail", kDaten.EMAIL);
						m.setProperty("/Vorname", kDaten.VORNAME);
						m.setProperty("/Nachname", kDaten.NACHNAME);

						//der registierte User wird direkt eingeloggt und zur Startseite weitergeleitet
						var eventBus = sap.ui.getCore().getEventBus(); //im Rootcontroller eingetragen
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

