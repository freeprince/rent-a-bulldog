sap.ui.define([
   "sap/ui/core/UIComponent",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel",
   "rab/model/models",
   "sap/ui/model/odata/v2/ODataModel"
], function (UIComponent, JSONModel, ResourceModel, models, ODataModel) {
    "use strict";
    return UIComponent.extend("rab.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            
            let i18n = new ResourceModel({
                bundleName: "rab.i18n.i18n"
            });
            this.setModel(i18n, "i18n");

            let oModelCrits = new JSONModel(this.loadODataCrits());
            this.setModel(oModelCrits, "crits");

            let oModelFilter = new JSONModel({
                Hersteller: [],
                Klasse: []
            });
            this.setModel(oModelFilter, "filter");
            
            let oModelKunden = new JSONModel({
            	Kunden: []
            });
            this.setModel(oModelKunden,"Kundendaten");

			// Webservice Url
            let url = window.location.protocol + "//ux5.edvschulen-plattling.de/sap/opu/odata/sap/ZANA_SEARCH_SERVICE/";
            // let url = window.location.protocol + "//ux5.edvschulen-plattling.de/~agabel/sap/proxy/ajax_proxy.php?route=/sap/opu/odata/sap/ZANA_SEARCH_SERVICE/";
			//  Anmeldeheader
			var header = {
				"Authorization": "Basic " + btoa("f12:xaxt")
            };
            // parameter
            let params = {
                json: true,
                user: "",
                password: "",
                header: header
            };
            let oModelOdata = new ODataModel(url, params);
			// ohne folgende Attribute geht der odataServer nicht
            this.setModel(oModelOdata, "service");
			oModelOdata.bDisableHeadRequestForToken = true;
			oModelOdata.bUseBatch = false;
			oModelOdata.refresh();

            // set the device model
            let oModelDevice = models.createDeviceModel();
			this.setModel(oModelDevice , "device");

            this.getRouter().initialize();            
        },
        loadODataCrits: function () {

            // Reservierung frühestens morgen
            let minDate = new Date();
            minDate.setDate(minDate.getDate() + 1);
            let minDate2 = new Date();
            minDate2.setDate(minDate.getDate() + 1);

            let day = minDate.getDate();
            if (day < 10)
                day = "0" + day;
            let month = minDate.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            let src = day + "." + month + "." + minDate.getFullYear();

            day = minDate2.getDate();
            if (day < 10)
                day = "0" + day;
            month = minDate2.getMonth() + 1;
            if (month < 10)
                month = "0" + month;
            let dst = day + "." + month + "." + minDate2.getFullYear();

            let critsOData = {
                duration: 1,
                minDate: {
                    src: minDate,
                    dst: minDate2
                },
                srcDate: src,
                dstDate: dst
            };
            return critsOData;
        }
    });
});