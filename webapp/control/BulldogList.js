sap.ui.define("rab.control.BulldogList", [
	"sap/ui/core/Control"
], function(Control, ) {
	"use strict";

	return Control.extend("rab.control.BulldogList", {
		metadata: {
			properties: {

			},

			aggregations: {
				"items": {
                    "type": "rab.control.BulldogListItem",
                    "multiple": true,
                    "singularName": "item"
                }
			},

			events: {
				
			}
		},
		
		init: function() {
		},
		
		renderer: function(oRm, oControl) {
			oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("bulldogList")
            oRm.writeClasses();			
            oRm.write(">");
            oRm.write("<ul>");
            $.each(oControl.getItems(), function(key, value) {
                oRm.renderControl(value);
            });
            oRm.write("</ul>");
            oRm.write("</div>");
		}
    });
});