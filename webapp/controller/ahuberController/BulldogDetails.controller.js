sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function(JSONModel, Controller) {
	"use strict";

	return Controller.extend("rab.controller.ahuberController.BulldogDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
			onInit: function() {
				// Model anlegen
				var bulldogDetailModel = new JSONModel({
					id: "",
					hersteller:"",
					modell: "",
					leistung: "",
					fuehrerscheinklasse: "",
					farbe: "",
					tagespauschale: "",
					preiProStunde: "",
					beschreibung:"",
					von: "",
					bis: ""
				});
				
				// Setzen des Models in die View (Einbinden)
				this.getView().setModel(bulldogDetailModel, "bulldogDetailModel");
				
				// Model befüllen
				bulldogDetailModel.hersteller = "Porsche";
				bulldogDetailModel.modell = "Carrera BD";
				bulldogDetailModel.leistung = "750";
				bulldogDetailModel.fuehrerscheinklasse = "T";
				bulldogDetailModel.farbe = "Grün";
				bulldogDetailModel.tagespauschale = 100;
				bulldogDetailModel.preiProStunde = 30;
				bulldogDetailModel.beschreibung ="Anhängekupplung, Zapfwelle, Allrad, Frontlader, Klimaanlage, Kaffeemaschine, DVD-Player, UKW-Radio, Unterbodenbeleuchtung, Heckspoiler Carbon, Lambotüren, Lichtpaket, Schischa, Microwelle";
				bulldogDetailModel.von = "01.04.2018";
				bulldogDetailModel.bis = "10.04.2018";

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

		onReservierungPress: function(oEvent){

			alert("Hallo");
		}

	});

});