sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "rab/util/Utils",
    "rab/util/Formatter",
    "rab/util/Cookie"
], function (Controller, MessageToast, JSONModel, ResourceModel, Utils, Formatter, Cookie) {
    "use strict";

    return Controller.extend("rab.controller.Search", {

        useOData: true,

        formatter: Formatter,

        onInit: function () {

            let oComponent = this.getOwnerComponent();
            let m = oComponent.getModel("crits");

            let diffDays = Utils.getDiffDays(m.getData().srcDate, m.getData().dstDate);
            m.setProperty("/duration", diffDays);

            this.doSearch();

            let addCrits = new JSONModel(this.loadODataCrits());
            this.getView().setModel(addCrits, "addCrits");

            let that = this;
            let manufacturers = new JSONModel();
            manufacturers.loadData("./mock/get_manufacturers.json");
            manufacturers.attachRequestCompleted(function () {
                that.getView().setModel(manufacturers, "manufacturers");
            });

            this.getView().setModel(new JSONModel({
                Classes: [{ Name: "L" }, { Name: "T" }]
            }), "classes");

            this.getView().setModel(new JSONModel({
                currency: "€",
                currencyDaily: "€ pro Tag"
            }), "view");
            this.getView().setModel(new JSONModel({
                value: diffDays
            }), "duration");
        },
        onDetailClicked: function (oEvent) {
            let oSelectedBulldog = oEvent.getParameter("value");
            console.log(oSelectedBulldog);

            let oComponent = this.getOwnerComponent();
            oComponent.setModel(new JSONModel(oSelectedBulldog), "bulldogDetailModel");

            Cookie.setCookie("bulldog", JSON.stringify(oSelectedBulldog), 7);

            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("details");
        },
        onPressUpdateCrits: function () {
            let show = true;
            let headerDate = this.getView().byId("headerDate");
            headerDate.setVisible(show);
            let headerLbl = this.getView().byId("headerLbl");
            headerLbl.setVisible(!show);
            let toolbar = this.getView().byId("toolbarHeader");
            toolbar.setHeight("80px");
        },
        onPressSaveCrits: function () {
            let show = false;
            let headerDate = this.getView().byId("headerDate");
            headerDate.setVisible(show);
            let headerLbl = this.getView().byId("headerLbl");
            headerLbl.setVisible(!show);
            let toolbar = this.getView().byId("toolbarHeader");
            toolbar.setHeight("50px");

            let oComponent = this.getOwnerComponent();
            let m = oComponent.getModel("crits");

            let diffDays = Utils.getDiffDays(m.getData().srcDate, m.getData().dstDate);
            m.setProperty("/duration", diffDays);

            this.getView().getModel("duration").setProperty("/value", diffDays);

            this.doSearch();
        },
        doSearch: function () {
            let that = this;

            let oComponent = this.getOwnerComponent();
            let oService = oComponent.getModel("service");
            let oModelCrits = oComponent.getModel("crits");
            let iDays = oModelCrits.getProperty("/duration");
            console.log("Search#doSearch: iDays=" + iDays);

            if (this.useOData) {

                let sd = oModelCrits.getProperty("/srcDate");
                let parts = sd.split(".");
                let srcDate = new Date(parts[2], parts[1], parts[0]);
                let dd = oModelCrits.getProperty("/dstDate");
                parts = dd.split(".");
                let dstDate = new Date(parts[2], parts[1], parts[0]);

                // srcDate = oModelCrits.getProperty("/srcDate");
                // dstDate = oModelCrits.getProperty("/dstDate");

                sap.ui.core.BusyIndicator.show(10);

                // one with id            
                // oService.read("/SearchResultSet(32)", {
                // multiple
                oService.read("/SearchResultSet", {
                    filters: [
                        new sap.ui.model.Filter({
                            path: 'von',
                            operator: sap.ui.model.FilterOperator.BT,
                            value1: srcDate,
                            value2: dstDate
                        })
                    ],
                    success: function (oRetrievedResult) {
                        console.log("Search result success");
                        let bulldogs = oRetrievedResult.results;
                        // console.log(bulldogs);
                        bulldogs = { Bulldogs: bulldogs };

                        for (let i = 0; i < bulldogs.Bulldogs.length; i++) {
                            let preis_gesamt = bulldogs.Bulldogs[i].preis_pro_tag;
                            preis_gesamt = preis_gesamt * iDays;
                            preis_gesamt = preis_gesamt.toFixed(2);
                            bulldogs.Bulldogs[i].preis_gesamt = preis_gesamt;
                        }

                        let oModel = new JSONModel();
                        oModel.setData(bulldogs);

                        let list = that.getView().byId("searchResultList");
                        list.setModel(oModel, "bulldogs");

                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        console.log("Search result error");
                        console.log(oError);
                        let responseText = JSON.parse(oError.responseText);
                        console.log(responseText);
                        let msg = responseText.error.message.value;
                        MessageToast.show(msg);
                        console.log(msg);
                    }
                });
            } else {
                let oModel = new JSONModel();
                oModel.loadData("./mock/get_search.json");
                oModel.attachRequestCompleted(function () {
                    let list = that.getView().byId("searchResultList");
                    list.setModel(oModel, "bulldogs");
                });

            }
        },
        onFilterHerstellerFinished: function (oEvent) {
            let aSelected = oEvent.getParameter("value");
            console.log("Search#onFilterFinished:", aSelected);

            let m = this.getView().getModel("addCrits");
            m.setProperty("/hersteller", aSelected);

            let oComponent = this.getOwnerComponent();
            let oModel = oComponent.getModel("filter");
            oModel.setProperty("/Hersteller", aSelected);

            this.doFilter();
        },
        onFilterKlasseFinished: function (oEvent) {
            let aSelected = oEvent.getParameter("value");
            console.log("Search#onFilterFinished:", aSelected);

            let m = this.getView().getModel("addCrits");

            m.setProperty("/klasse/L", false);
            m.setProperty("/klasse/L", false);

            for (let sValue in aSelected) {
                sValue = aSelected[sValue];
                if (sValue == 'T') {
                    m.setProperty("/klasse/T", true);
                } else if (sValue == 'L') {
                    m.setProperty("/klasse/L", true);
                }
            }

            let oComponent = this.getOwnerComponent();
            let oModel = oComponent.getModel("filter");
            oModel.setProperty("/Klasse", aSelected);

            this.doFilter();
        },
        doFilter: function (oEvent) {
            let aFilters = [];

            let addCrits = this.getView().getModel("addCrits").getData();

            // Filter für Hersteller
            let filtersHersteller = [];
            for (let i = 0; i < addCrits.hersteller.length; i++) {
                let h = addCrits.hersteller[i];
                if (h) {
                    filtersHersteller.push(new sap.ui.model.Filter({
                        path: "hersteller",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: h
                    }));
                }
            }
            if (filtersHersteller.length > 0) {
                console.log("Search: Filter Hersteller: " + addCrits.hersteller);
                aFilters.push(new sap.ui.model.Filter({
                    filters: filtersHersteller,
                    and: false
                }));
            }

            // Filter für Klasse
            if (addCrits.klasse.T != addCrits.klasse.L
                && addCrits.klasse.L || addCrits.klasse.T) {
                console.log("Search: Filter Klasse: L:", addCrits.klasse.L, "T:", addCrits.klasse.T);
                aFilters.push(new sap.ui.model.Filter({
                    path: "klasse",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: addCrits.klasse.L ? "L" : "T"
                }));
            }

            // Filter für Leistung
            if (addCrits.leistung.von > 0
                && addCrits.leistung.bis > 0) {
                console.log("Search: Filter Leistung: von", addCrits.leistung.von, "bis", addCrits.leistung.bis)
                aFilters.push(new sap.ui.model.Filter({
                    path: "leistung",
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: addCrits.leistung.von,
                    value2: addCrits.leistung.bis
                }));
            } else if (addCrits.leistung.von > 0) {
                console.log("Search: Filter Leistung: von", addCrits.leistung.von)
                aFilters.push(new sap.ui.model.Filter({
                    path: "leistung",
                    operator: sap.ui.model.FilterOperator.GE,
                    value1: addCrits.leistung.von,
                }));
            } else if (addCrits.leistung.bis > 0) {
                console.log("Search: Filter Leistung: bis", addCrits.leistung.bis)
                aFilters.push(new sap.ui.model.Filter({
                    path: "leistung",
                    operator: sap.ui.model.FilterOperator.LE,
                    value1: addCrits.leistung.bis,
                }));
            }

            // Filter für Preis
            if (addCrits.preisProTag.von > 0
                && addCrits.preisProTag.bis > 0) {
                console.log("Search: Filter preisProTag: von", addCrits.preisProTag.von, "bis", addCrits.preisProTag.bis)
                aFilters.push(new sap.ui.model.Filter({
                    path: "preis_pro_tag",
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: addCrits.preisProTag.von,
                    value2: addCrits.preisProTag.bis
                }));
            } else if (addCrits.preisProTag.von > 0) {
                console.log("Search: Filter preisProTag: von", addCrits.preisProTag.von)
                aFilters.push(new sap.ui.model.Filter({
                    path: "preis_pro_tag",
                    operator: sap.ui.model.FilterOperator.GE,
                    value1: addCrits.preisProTag.von,
                }));
            } else if (addCrits.preisProTag.bis > 0) {
                console.log("Search: Filter preisProTag: bis", addCrits.preisProTag.bis)
                aFilters.push(new sap.ui.model.Filter({
                    path: "preis_pro_tag",
                    operator: sap.ui.model.FilterOperator.LE,
                    value1: addCrits.preisProTag.bis,
                }));
            }

            let oList = this.byId("searchResultList");
            let oBinding = oList.getBinding("items");
            oBinding.filter(new sap.ui.model.Filter({
                filters: aFilters,
                and: true
            }), sap.ui.model.FilterType.Application);  //apply the filter
        },
        loadODataCrits: function () {
            let critsOData = {
                hersteller: [],
                modell: [],
                klasse: {
                    L: false,
                    T: false
                },
                leistung: {
                    von: 0,
                    bis: 0
                },
                preisProTag: {
                    von: 0,
                    bis: 0
                },
                preisProStd: {
                    von: 0,
                    bis: 0
                },
                beschreibung: ""
            };
            return critsOData;
        }
    });
});