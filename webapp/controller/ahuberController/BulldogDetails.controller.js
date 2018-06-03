sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"rab/model/ahuberModels",
	"rab/util/Cookie"
], function (JSONModel, Controller, MessageToast, ahuberModels, Cookie) {
	"use strict";

	return Controller.extend("rab.controller.ahuberController.BulldogDetails", {

		onInit: function () {
			let c = Cookie.getCookie("bulldog");
			console.log("BulldogDetails#onInit : cookie bulldog :", c);
			if (c) {				
				let oSelectedBulldog = JSON.parse(c);
				let oComponent = this.getOwnerComponent();
				oComponent.setModel(new JSONModel(oSelectedBulldog), "bulldogDetailModel");		
			}
		},

		toDate: function (dateStr) {
			const [day, month, year] = dateStr.split("-");
			return new Date(year, month - 1, day);
		},

		preisVorschau: function () {
			// Vorschau für die Preise
		},

		onChangeDate: function (oEvent) {
			// let bulldog = this.getView().getModel("bulldogDetailModel");
			// let bisSave = bulldog.getProperty("/bis");

			// let v = bulldog.getProperty("/von").split(".");
			// let b = bulldog.getProperty("/bis").split(".");
			// let von = parseInt(v[0] + v[1] + v[2]);
			// let bis = parseInt(b[0] + b[1] + b[2]);

			// if (von > bis) {
			// 	MessageToast.show("Datum ungültig!");
			// 	bulldog.setProperty("/von", bulldog.getProperty("/bis"));
			// 	bulldog.setProperty("/bis", bisSave);
			// }
		},

		onReservierungPress: function (oEvent) {
			// Prüfen ob user eingeloggt ist ()
			let c = Cookie.getCookie("kunde");
			if (!c) {
				MessageToast.show("Bitte anmelden");
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("login");
			} else {
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Bestelluebersicht");
			}

		}

	});

});