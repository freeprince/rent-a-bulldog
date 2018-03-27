sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "rab/util/Utils",
    "rab/util/Formatter"
], function (Controller, MessageToast, JSONModel, ResourceModel, Utils, Formatter) {
    "use strict";
    return Controller.extend("rab.controller.Search", {

        useOData: false,

        formatter: Formatter,

        onInit: function () {
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

            let oViewModel = new JSONModel({
                currency: "€",
                currencyDaily: "€ pro Tag"
            });
            this.getView().setModel(oViewModel, "view");
        },
        onItemPress: function (oEvent) {
            console.log("Search#onItemPress");
            console.log(oEvent);
            // The actual Item
            let oItem = oEvent.getSource();
            // The model that is bound to the item
            let oContext = oItem.getBindingContext("DC");
            // A single property from the bound model
            let sName = oContext.getProperty("Name");
            console.log(sName);
        },
        onDetailClicked: function (oEvent) {
            MessageToast.show("Warenkorb ist noch nicht bereit!");
            let src = oEvent.getSource();
            console.log(oEvent);
            let aParts = src.sId.split("-");
            let id = aParts[aParts.length - 1];
            console.log("id:" + id);

            // TODO Filter beachten
            let list = this.getView().byId("searchResultList");
            let oModel = list.getModel("bulldogs");
            let oData = oModel.oData;
            let aBulldogs = oData.Bulldogs;

            let selectedBulldog = aBulldogs[id];
            console.log("Search: selectedBulldog", selectedBulldog);

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
                // one with id            
                // oService.read("/SearchResultSet(32)", {
                // multiple
                oService.read("/SearchResultSet", {
                    // filters: [ new sap.ui.model.Filter({
                    //     path: 'von',
                    //     operator: sap.ui.model.FilterOperator.EQ,
                    //     value1: '01.01.2018'
                    // })],
                    success: function (oRetrievedResult) {
                        console.log("Search result success");
                        let bulldogs = oRetrievedResult.results;
                        bulldogs = { Bulldogs: bulldogs };
                        console.log(bulldogs);

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
                    },
                    error: function (oError) {
                        console.log("Search result error");
                        console.log(oError);
                    }
                });
            } else {
                let that = this;
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
                sValue
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

            let addCrits = this.getView().getModel("addCrits").getData();;

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