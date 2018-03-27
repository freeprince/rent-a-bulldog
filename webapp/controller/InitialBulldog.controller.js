sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "rab/util/Formatter"
], function (Controller, JSONModel, Formatter) {
    "use strict";
    return Controller.extend("rab.controller.InitialBulldog", {
        
        formatter: Formatter,
        
        onInit: function () {            			
			let oViewModel = new JSONModel({
                currency: "€",
                currencyDaily: "€ pro Tag"
			});
			this.getView().setModel(oViewModel, "view");
        },
        onDetailClicked: function () {
            let oModel = this.getView().getModel("featured");
            console.log(oModel.getData());
        }
    });
});