sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "rab/model/ahuberModels"
], function (JSONModel, Controller, MessageToast, ahuberModels) {
    "use strict";

    return Controller.extend("rab.controller.ahuberController.Bestelluebersicht", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf rab.view.ahuberView.view.BulldogDetails
		 */
        onInit: function () {
            var bulldogDetailModel = ahuberModels.createBulldogModel();


            // Model befüllen
            bulldogDetailModel.setProperty("/hersteller", "Deutz");
            bulldogDetailModel.setProperty("/modell", "Carrar BD");
            bulldogDetailModel.setProperty("/leistung", 750);

            // Setzen des Models in die View (Einbinden)
            //this.getView().setModel(bulldogDetailModel, "bulldogDetailModel");
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

        onPaketChange: function (oEvent) {

        },

        setPreis: function (auswahl) {

        },

        onJetztBestellenPress: function (oEvent) {
            // Prüfungen

            //let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //oRouter.navTo("BestellungErfolgreich");
            MessageToast.show("Bulldog erfolgreich bestellt");
        }
    });

});