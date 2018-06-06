sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "rab/util/Formatter",
    "rab/util/Cookie"
], function (JSONModel, Controller, MessageToast, Formatter, Cookie) {
    "use strict";

    return Controller.extend("rab.controller.ahuberController.Bestelluebersicht", {

        // Formatiert den Preis auf 2 Nachkommerstellen (wird in der View verwendet)
        formatter: Formatter,

        // Initialfunktion, wird beim Seitenstart aufgerufen
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Bestelluebersicht").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Event wurden in Root.controller.js definiert
            var eventBus = sap.ui.getCore().getEventBus();
            // Cookie mit ausgewähltem Bulldog wird geholt (merkt sich Bulldog falls man die Seite erneut aufruft)
            let c = Cookie.getCookie("bulldog");
            //console.log("Bestelluebersicht#onInit : cookie bulldog :", c);
            console.log("Bestelluebersicht#onInit : cookie bulldog :", c);

            //Falls Cookie vorhanden wird Bulldog angezeigt
            if (c) {
                let oSelectedBulldog = JSON.parse(c);

                let oComponent = this.getOwnerComponent();
                oComponent.setModel(new JSONModel(oSelectedBulldog), "bulldogDetailModel");

                let duration = oComponent.getModel("crits").getProperty("/duration");
                let preisProTag = parseFloat(oSelectedBulldog.tagespauschale.replace(",", "."));
                let preisDauer = duration * preisProTag;
                //console.log("oSelectedBulldog:", oSelectedBulldog);
                //console.log("duration:", duration);
                //console.log("preisProTag:",  preisProTag);
                //console.log("preisDauer:",  preisDauer);

                // Hier werden die Preise gesetzt
                this.getView().setModel(new JSONModel({
                    Dauer: preisDauer,
                    Paket: 0,
                    Vollkasko: 0,
                    Gesamt: 0
                }), "preise");

                this.berechneGesamtpreis();
            } else {
                // Wenn kein Cookie vorhanden dann zurück zur Startseite
                eventBus.publish("Root", "navToHome", null);
            }
        },

        // Funktion für die Auswahl des Radiobuttons
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
            // Sobald RB geändert wird, wird neuer Preis berechnet & angezeigt
            this.getView().getModel("preise").setProperty("/Paket", paketPreis);
            this.berechneGesamtpreis();
        },

        // Funktion für die Auswahl der Versicherung
        onVersicherungChange: function (oEvent) {
            let preis = 0;
            let b = oEvent.getSource().getSelected();
            if (b) {
                preis = 100;
            }
            // Preis für ausgewählte Versicherung setzten
            this.getView().getModel("preise").setProperty("/Vollkasko", preis);
            this.berechneGesamtpreis();
        },

        // Berechnet den Gesamtpreis, abhängig von den gewählten Optionen
        berechneGesamtpreis: function () {
            let m = this.getView().getModel("preise");
            let dauerPreis = m.getProperty("/Dauer");
            let paketPreis = m.getProperty("/Paket");
            let vollkasko = m.getProperty("/Vollkasko");
            let gesamt = dauerPreis + paketPreis + vollkasko;
            m.setProperty("/Gesamt", gesamt);
        },

        onJetztBestellenPress: function (oEvent) {
            // Prüfungen ob die AGBs akzeptiert wurden
            let cb = this.byId("cbAgb");
            if (cb.getSelected()) {
                //console.log("agbs akzeptiert");
            } else {
                MessageToast.show("Kein Bestellung ohne die AGBs gelesen und akzeptiert zu haben!");
                return;
            }

            // Löscht das Cookie sobald der Bestellvorgang abgeschlossen ist
            Cookie.eraseCookie("bulldog");

            MessageToast.show("Bulldog erfolgreich bestellt");
            var eventBus = sap.ui.getCore().getEventBus();
            // Geht zurück zur Startseite
            eventBus.publish("Root", "navToHome", null);
        }
    });

});
