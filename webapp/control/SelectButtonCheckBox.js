sap.ui.define("rab.control.SelectButtonCheckBox", [
	"sap/ui/core/Control",
	"sap/m/CheckBox"
], function(Control, CheckBox) {
	"use strict";

	return Control.extend("rab.control.SelectButtonCheckBox", {
		metadata: {
			properties: {
				"data": "object",
				"checked": "boolean"
			},

			aggregations: {
				checkbox           : {type : "sap.m.CheckBox", multiple: false, visibility : "hidden"},
			},

			events: {
				checkedChange : {
                    enablePreventDefault: true,
                    parameters : {
						checked : {type : "boolean"}
                    }
                },
			}
		},
		
		init: function() {
			let oControl = this;

			let cb = new sap.m.CheckBox({
				select: this._onSelect.bind(this)
			})
			.addStyleClass("checkbox")
			.addStyleClass("selectButtonCheckBox");			
			this.setAggregation("checkbox", cb);
		},
				
		_onSelect: function(oEvent) {
			let bSelected = this.getAggregation("checkbox").getProperty("selected");
			console.log("SelectButtonCheckBox._onSelect:", bSelected);			
			this.fireEvent("checkedChange", {
				checked: bSelected
			});
		},

		renderer: function(oRm, oControl) {
			let name = oControl.getData().Name;
	    	oRm.write("<li>");
			//oRm.write("<input type=\"checkbox\" name=\"cb" + name + "\" class=\"checkbox\">");
			let cb = oControl.getAggregation("checkbox");
			cb.text = name
			oRm.renderControl(cb);
			oRm.write("<div");
			oRm.addClass("selectButtonCheckBoxText");
			oRm.writeClasses();                                
			oRm.write(">");
			oRm.write(name);
			oRm.write("</div>");
			oRm.write("</li>");
		},
		
		onAfterRendering: function(oEvent) {},
		
		setSelected: function(bValue) {
			this.getAggregation("checkbox").setProperty("selected", bValue, true);
			return this;
		},

		isSelected: function() {
			return this.getAggregation("checkbox").getProperty("selected");
		},

		setData: function(value) {
			this.setProperty("data", value, true);
			return this;
		}
	});

});