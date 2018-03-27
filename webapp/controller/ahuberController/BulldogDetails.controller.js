sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (JSONModel, Controller, MessageToast) {
	"use strict";

	return Controller.extend("rab.controller.ahuberController.BulldogDetails", {



		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
		onInit: function () {
			// Model anlegen
			var bulldogDetailModel = new JSONModel({
				id: "",
				hersteller: "",
				modell: "",
				leistung: "",
				fuehrerscheinklasse: "",
				farbe: "",
				tagespauschale: "",
				preiProStunde: "",
				beschreibung: "",
				von: "",
				bis: ""
			});

			// Model befüllen
			bulldogDetailModel.setProperty("/hersteller", "Deutz");
			bulldogDetailModel.setProperty("/modell","Carrar BD");
			bulldogDetailModel.setProperty("/leistung",750);
			bulldogDetailModel.setProperty("/fuehrerscheinklasse","T");
			bulldogDetailModel.setProperty("/farbe","Grün");
			bulldogDetailModel.setProperty("/tagespauschale",100);
			bulldogDetailModel.setProperty("/preisProStunde",30);
			bulldogDetailModel.setProperty("/beschreibung","Anhängekupplung, Zapfwelle, Allrad, Frontlader, Klimaanlage, Kaffeemaschine, DVD-Player, UKW-Radio, Unterbodenbeleuchtung, Heckspoiler Carbon, Lambotüren, Lichtpaket, Schischa, Microwelle");
			bulldogDetailModel.setProperty("/von","01.04.2018");
			bulldogDetailModel.setProperty("/bis","10.04.2018");

			console.log("---------------------------------------------");
			console.log(bulldogDetailModel);

			// Setzen des Models in die View (Einbinden)
			this.getView().setModel(bulldogDetailModel, "bulldogDetailModel");



		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
		//	onExit: function() {
		//
		//	}

		toDate: function(dateStr) {
			const [day, month, year] = dateStr.split("-")
			return new Date(year, month - 1, day)
		},


		onChangeDate: function(oEvent){
			let bulldog = this.getView().getModel("bulldogDetailModel");
			let bisSave = bulldog.getProperty("/bis");
			
			let v = bulldog.getProperty("/von").split(".");
			let b = bulldog.getProperty("/bis").split(".");
			let von = parseInt(v[0]+v[1]+v[2]);
			let bis = parseInt(b[0]+b[1]+b[2]);

			if(von > bis){
				MessageToast.show("Datum ungültig!");
				bulldog.setProperty("/von", bulldog.getProperty("/bis"));
				bulldog.setProperty("/bis", bisSave);
			}
		},

		onReservierungPress: function (oEvent) {
			// Prüfen ob user eingeloggt ist ()

			alert("Hallo");
		}

	});

});