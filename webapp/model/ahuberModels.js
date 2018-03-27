

sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
        createBulldogModel: function(){
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
            return bulldogDetailModel;
        }
	};
});