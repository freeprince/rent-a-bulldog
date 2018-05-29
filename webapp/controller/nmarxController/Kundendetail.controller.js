sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	"rab/util/Cookie"
], function (jQuery, Fragment, Controller, JSONModel, MessageToast, Cookie) {
	"use strict";

	var CController = Controller.extend("rab.controller.nmarxController.Kundendetail", {

		onInit: function () {
			let c = Cookie.getCookie("kunde");
			let data = JSON.parse(c);
			if (data == null) {
				return;
			}

			let c2 = Cookie.getCookie("kundenliste");
			let kundenliste = JSON.parse(c2);
			for(let i in kundenliste) {
				let kunde = kundenliste[i];
				if (kunde.EMail == data.EMail) {
					data = kunde;
					break;
				}
			}

			let oModel = new JSONModel(data);
			this.getView().setModel(oModel, "Kundendaten");
		},

		onBeforeRendering: function () {
			
		},

		onExit: function () {
		}
	});


	return CController;

});