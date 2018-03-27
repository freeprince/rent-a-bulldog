jQuery.sap.declare("rab.util.Types");

util.Types = function() {
};

util.Types.DATE = new sap.ui.model.type.Date({
	pattern : "dd.MM.yyyy"
});

util.Types.DATE_FULL = new sap.ui.model.type.Date({
	source : {
		pattern : "dd.MM.yyyy"
	},
	pattern : "EEE dd MMM. yyyy"
});