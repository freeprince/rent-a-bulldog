// https://blogs.sap.com/2017/03/25/ui5-custom-controls-with-aggregation/
sap.ui.define("rab.control.BulldogListItem", [
	"sap/ui/core/Control"
], function(Control, ) {
	"use strict";

	return Control.extend("rab.control.BulldogListItem", {
		metadata: {
			properties: {
				bulldogId: "int",
				imageSource: "string",
				manufacturer: "string",
				modell: "string",
				color: "string",
				power: "string",
				desc: "string",
				year: "string",
				hours: "string",
				bulldogClass: "string",
				price: "string",
				priceHourly: "string",
				fullPrice: "string"
			},

			aggregations: {
				_button : {type : "sap.m.Button", multiple : false, visibility: "hidden"},
			},

			events: {
				 press : {
                    enablePreventDefault: true,
                    parameters : {
						value : {type : "object"}
                    }
                },
			}
		},
		
		init: function() {
			let oControl = this;
			let btn = new sap.m.Button({
				text: "Jetzt mieten",
                design: "Bold",
                press: oControl._onSelect.bind(oControl)
			});
			btn.addStyleClass("bulldogListItemButton");
			this.setAggregation("_button", btn);
		},

		_onSelect: function(oEvent) {
			let iId = this.getBulldogId();
			let sManufacturer = this.getManufacturer();
			let that = this;
			console.log("clicked on bulldog:", iId);
			this.fireEvent("press", {
				value: {
					bulldog_id: iId,
					img_url: that.getImageSource(),
					hersteller: sManufacturer,
					modell: that.getModell(),
					leistung: that.getPower(),
					fuehrerscheinklasse: that.getBulldogClass(),
					farbe: that.getColor(),
					tagespauschale: that.getPrice(),
					preisProStunde: that.getPriceHourly(),
					beschreibung: that.getDesc(),
					von: null,
					bis: null
				}
            });            
		},
		
		renderer: function(oRm, oControl) {
			oRm.write("<li");
			oRm.addClass("bulldogListItem");
			oRm.writeClasses();			
			oRm.write(">");
			
				oRm.write("<div>");
				oRm.write("<div");
				oRm.addClass("bulldogListItemDiv");
				oRm.writeClasses();			
				oRm.write(">");

					oRm.write("<div");
					oRm.addClass("bulldogListItemImageDiv");
					oRm.writeClasses();			
					oRm.write(">");
						oRm.write("<img");
						oRm.writeAttributeEscaped("src", oControl.getImageSource());
						oRm.addClass("bulldogListItemImage");
						oRm.writeClasses();			
						oRm.write(">");
					oRm.write("</div>");

					oRm.write("<div");
					oRm.addClass("bulldogListItemText");
					oRm.writeClasses();			
					oRm.write(">");
						oRm.renderControl(new sap.m.VBox({
							items: [
								new sap.m.Title({
									text: oControl.getManufacturer()
								}),
								new sap.m.Title({
									text: oControl.getModell()
								}),
								new sap.m.Label({
									text: "Farbe: " + oControl.getColor()
								}),
								new sap.m.Label({
									text: "Leistung: " + oControl.getPower()
								}),
								new sap.m.Label({
									text: "Klasse: " + oControl.getBulldogClass()
								}),
								new sap.m.Label({
									text: "Baujahr: " + oControl.getYear()
								}),
								new sap.m.Label({
									text: "Betriebsstd.: " + oControl.getHours()
								}),
								new sap.m.Label({
									text: "Beschreibung: " + oControl.getDesc()
								})
							]
						}));
					oRm.write("</div>");

					oRm.write("<div");
					oRm.addClass("bulldogListItemPrices");
					oRm.writeClasses();			
					oRm.write(">");						
						oRm.renderControl(new sap.m.VBox({
							items: [
								new sap.m.Title({
									text: oControl.getPrice()
								}),
								new sap.m.Label({
									text: oControl.getFullPrice()
								})
							]
						}));
					oRm.write("</div>");
					
					let btn = oControl.getAggregation("_button");
					oRm.renderControl(btn);						

				oRm.write("</div>");
				oRm.write("</div>");

				oRm.write("<hr");
				oRm.addClass("bulldogListItemDivider");
				oRm.writeClasses();							
				oRm.write("/>");

			oRm.write("</li>");
		},

		setImageSource: function(value) {
			this.setProperty("imageSource", value, true);
			return this;
		}
    });
});