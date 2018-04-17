sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "rab/util/Utils"
], function (Controller, MessageToast, JSONModel, ResourceModel, Utils) {
    "use strict";
    return Controller.extend("rab.controller.Initial", {
        
		_iCarouselTimeout: 0, // a pointer to the current timeout
		_iCarouselLoopTime: 5000, // loop to next picture after 5 seconds

        onInit: function () {
            // let p = this.getOwnerComponent().getAggregation("rootControl");
            // console.log(p);
            // p.oController.testMethod();
            
            let imgModel = new JSONModel({
                "img1": "https://mytoys.scene7.com/is/image/myToys/ext/1209139-01.jpg?wid=400&hei=400&fmt=jpeg&qlt=25,1&resMode=trilin&op_usm=0.9,1,5,1",
                "img2": "https://mytoys.scene7.com/is/image/myToys/ext/3265695-01.jpg?wid=400&hei=400&fmt=jpeg&qlt=25,1&resMode=trilin&op_usm=0.9,1,5,1",
                "img3": "https://mytoys.scene7.com/is/image/myToys/ext/4803322-01.jpg?wid=400&hei=400&fmt=jpeg&qlt=25,1&resMode=trilin&op_usm=0.9,1,5,1"
            });
            this.getView().setModel(imgModel, "img");

            let that = this;
            let featuredModel = new JSONModel();
            featuredModel.loadData("./mock/get_featured.json");
            featuredModel.attachRequestCompleted(function () {
                that.getView().setModel(featuredModel, "featured");
            });

			// select random carousel page at start
			let oWelcomeCarousel = this.byId("welcomeCarousel");
			let iRandomIndex = Math.floor(Math.random() * oWelcomeCarousel.getPages().length - 1);
			oWelcomeCarousel.setActivePage(oWelcomeCarousel.getPages()[iRandomIndex]);
        },
        
        onAfterRendering: function () {
			this.onCarouselPageChanged();
        },

        onCarouselPageChanged: function () {
			clearTimeout(this._iCarouselTimeout);
			this._iCarouselTimeout = setTimeout(function () {
				let oWelcomeCarousel = this.byId("welcomeCarousel");
				if (oWelcomeCarousel) {
					oWelcomeCarousel.next();
					this.onCarouselPageChanged();
				}
			}.bind(this), this._iCarouselLoopTime);
		},

        onSearchClicked: function (oEvent) {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("search");
        }
    });
});