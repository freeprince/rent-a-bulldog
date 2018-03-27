sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
	"use strict";

	var formatter = {
		/**
		 * Formats the price
		 * @param {string} sValue model price value
		 * @return {string} formatted price
		 */
		price: function (sValue) {
			let numberFormat = NumberFormat.getFloatInstance({
				maxFractionDigits: 2,
				minFractionDigits: 2,
				groupingEnabled: true,
				groupingSeparator: ".",
				decimalSeparator: ","
			});
			return numberFormat.format(sValue);
		},

		/**
		 * Sums up the price for all products in the cart
		 * @param {object} oCartEntries current cart entries
		 * @return {string} string with the total value
		 */
		totalPrice: function (oCartEntries) {
			let oBundle = this.getResourceBundle()
			let fTotalPrice = 0;

			Object.keys(oCartEntries).forEach(function (sProductId) {
				let oProduct = oCartEntries[sProductId];
				fTotalPrice += parseFloat(oProduct.Price) * oProduct.Quantity;
			});

			return oBundle.getText("cartTotalPrice", [formatter.price(fTotalPrice)]);
		},

        /**
		 * Checks if one of the collections contains items.
		 * @param {object} oCollection1 First array or object to check
		 * @param {object} oCollection2 Second array or object to check
		 * @return {boolean} true if one of the collections is not empty, otherwise - false.
		 */
		hasItems: function (oCollection1, oCollection2) {
			return !(jQuery.isEmptyObject(oCollection1) && jQuery.isEmptyObject(oCollection2));
		}
	};

	return formatter;
});
