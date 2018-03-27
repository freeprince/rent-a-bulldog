sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/resource/ResourceModel"
], function (Controller, MessageToast, JSONModel, ResourceModel) {
   "use strict";
   return Controller.extend("rab.controller.App", {
       onInit: function() {
          
       },
       onExit: function() {
        
       },
       testMethod: function() {
           console.log("App.controller.js called");
       }
   });
});