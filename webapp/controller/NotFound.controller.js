sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("rab.controller.NotFound", {
        onInit: function () {
        },
        navToHome: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("");
        }
    });
});