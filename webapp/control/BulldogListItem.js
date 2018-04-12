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
				price: "string",
				fullPrice: "string"
			},

			aggregations: {
				_button : {type : "sap.m.Button", multiple : false, visibility: "hidden"},
			},

			events: {
				
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
			console.log("clicked on bulldog:", iId, oEvent);
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
									text: oControl.getColor()
								}),
								new sap.m.Label({
									text: oControl.getPower()
								}),
								new sap.m.Label({
									text: oControl.getDesc()
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