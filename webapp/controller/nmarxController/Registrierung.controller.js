sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast'
], function(Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("rab.controller.nmarxController.Registrierung", {
		onInit: function () {

			// set explored app's demo model on this sample
			var oModel = new JSONModel({
			AnredeCollection:	[{text:"Herr"},{text:"Frau"}]
			});
			this.getView().setModel(oModel,"Anrede");
			
			var oKundenModel = new JSONModel({
			Vorname: "",
			Nachname: "",
			Straße: "",
			Hausnummer: "",
			Plz: "",
			Ort: "",
			EMail: "",
			Passwort: "",
			Passwortbestätigung: ""
			
			});
			this.getView().setModel(oKundenModel,"Kundendaten");
		},
		
		registrieren: function(){
			var kDaten = this.getView().getModel("Kundendaten").getData();
			if(kDaten.Passwort === kDaten.Passwortbestätigung){
			  let oComponent = this.getOwnerComponent();
            let m = oComponent.getModel("Kundendaten"); //das globale model für Kundendaten
            m.getProperty("/Kunden"); //liste mit den registrierten Kunden holen
            let listeZuweisen = m.getProperty("/Kunden");
            listeZuweisen.push(kDaten);
            m.setProperty("/Kunden",listeZuweisen); //aktualisiert die Kundenliste
			}
			MessageToast.show("Registrierung war erfolgreich");
			console.log(kDaten);
			}
		
	

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf rab.view.nmarxView.view.nmarxView.view.Registrierung
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf rab.view.nmarxView.view.nmarxView.view.Registrierung
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf rab.view.nmarxView.view.nmarxView.view.Registrierung
		 */
		//	onExit: function() {
		//
		//	}

	});

});