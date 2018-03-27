sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (Controller, MessageToast, JSONModel, ResourceModel) {
   "use strict";
   return Controller.extend("rab.controller.Contact", {
        onInit: function() {
            let oModel = new JSONModel(this.loadOData());
            this.getView().setModel(oModel, "view");
            console.log(oModel.getData());
        },
        loadOData: function() {
            let data = {
                "SupplierName": "Unbekannt",
                "Street": "Georg-Eckl-Straße",
                "HouseNumber": "18",
                "ZIPCode": "94447",
                "City": "Plattling",
                "Country": "Deutschland",
                "Url": "www.rent-a-bulldog.de",
                "Email": "support@rent-a-bulldog.de"
            };
            return data;
        },
        onNavToWebsite: function(oEvent) {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("");
        }
   });
});