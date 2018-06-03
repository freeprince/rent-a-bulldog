sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "rab/util/Formatter",
    "rab/util/Cookie"
], function (JSONModel, Controller, MessageToast, Formatter, Cookie) {
    "use strict";

    return Controller.extend("rab.controller.ahuberController.Bestelluebersicht", {

        formatter: Formatter,

        onInit: function () {

            var eventBus = sap.ui.getCore().getEventBus();
            let c = Cookie.getCookie("bulldog");
            console.log("Bestelluebersicht#onInit : cookie bulldog :", c);
            if (c) {
                let oSelectedBulldog = JSON.parse(c);

                let oComponent = this.getOwnerComponent();
                oComponent.setModel(new JSONModel(oSelectedBulldog), "bulldogDetailModel");
                
                let duration = oComponent.getModel("crits").getProperty("/duration");                
                let preisProTag = parseFloat(oSelectedBulldog.tagespauschale.replace(",", "."));
                let preisDauer = duration * preisProTag;
                console.log("oSelectedBulldog:", oSelectedBulldog);
                console.log("duration:", duration);
                console.log("preisProTag:",  preisProTag);
                console.log("preisDauer:",  preisDauer);

                this.getView().setModel(new JSONModel({
                    Dauer: preisDauer,
                    Paket: 0,
                    Vollkasko: 0,
                    Gesamt: 0
                }), "preise");
    
                this.berechneGesamtpreis();
            } else {
                eventBus.publish("Root", "navToHome", null);
            }
        },


        onPaketChange: function (oEvent) {
            let paketPreis = 0.0;
            let rbId = oEvent.getSource().getId();
            if (rbId.endsWith("Small")) {
                paketPreis = 50.0;
            } else if (rbId.endsWith("Medium")) {
                paketPreis = 100.0;
            } else if (rbId.endsWith("Large")) {
                paketPreis = 200.0;
            }
            this.getView().getModel("preise").setProperty("/Paket", paketPreis);
            this.berechneGesamtpreis();
        },

        onVersicherungChange: function (oEvent) {
            let preis = 0;
            let b = oEvent.getSource().getSelected();
            if (b)
                preis = 100;
            this.getView().getModel("preise").setProperty("/Vollkasko", preis);
            this.berechneGesamtpreis();
        },

        berechneGesamtpreis: function () {
            let m = this.getView().getModel("preise");
            let dauerPreis = m.getProperty("/Dauer");
            let paketPreis = m.getProperty("/Paket");
            let vollkasko = m.getProperty("/Vollkasko");
            let gesamt = dauerPreis + paketPreis + vollkasko;
            m.setProperty("/Gesamt", gesamt);
        },

        onJetztBestellenPress: function (oEvent) {
            // Prüfungen
            let cb = this.byId("cbAgb");
            if (cb.getSelected()) {
                console.log("agbs akzeptiert");
            } else {
                MessageToast.show("Kein Bestellung ohne die AGBs gelesen und akzeptiert zu haben!");
                return;
            }

            Cookie.eraseCookie("bulldog");

            MessageToast.show("Bulldog erfolgreich bestellt");
            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.publish("Root", "navToHome", null);
        }
    });

});