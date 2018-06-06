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
			let that = this;
			let kDaten = this.getView().getModel("Kundendaten").getData();

			let oServiceKunde = this.getOwnerComponent().getModel("serviceKunde");
			oServiceKunde.read("/ZANA_KUNDE", {
				success: function (oRetrievedResult) {
					console.log("Kunde success");
					let kunden = oRetrievedResult.results;
					console.log(kunden);

					let erfolg = false;

					let kunde = null;
					for (let i in kunden) {
						kunde = kunden[i];
						if (kunde.EMAIL === kDaten.EMail && kunde.PASSWORT === kDaten.Passwort) {
							kunde = {
								EMAIL: kunde.EMAIL,
								VORNAME: kunde.VORNAME,
								NACHNAME: kunde.NACHNAME,
								STRASSE: kunde.STRASSE,
								PLZ: kunde.ORT,
								TELEFON: kunde.TELEFON,
								GEBURTSDATUM: kunde.GEBURTSDATUM,
								FNR: kunde.FNR,
								ftyp: kunde.ftyp,
								ausstell_datum: kunde.ausstell_datum
							};
							erfolg = true;
							break;
						}
					}

					if (erfolg) {
						$(".lbl-err").hide();

						that.getView().setModel(new JSONModel({
							EMail: "",
							Passwort: ""
						}), "Kundendaten");

						let m = that.getOwnerComponent().getModel("user");
						m.setProperty("/EMail", kunde.EMAIL);
						m.setProperty("/Vorname", kunde.VORNAME);
						m.setProperty("/Nachname", kunde.NACHNAME);

						Cookie.eraseCookie("kunde");

						MessageToast.show("Anmeldung war erfolgreich");
						Cookie.setCookie("kunde", JSON.stringify(kunde), 1);

						var eventBus = sap.ui.getCore().getEventBus();
						eventBus.publish("Root", "login", kunde);

						let c3 = Cookie.getCookie("bulldog");
						if (c3) {
							eventBus.publish("Root", "navToDetail", null);
						} else {
							eventBus.publish("Root", "navToHome", null);
						}
					} else {
						$(".lbl-err").show();
					}
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