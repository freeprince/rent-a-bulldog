sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	"rab/util/Cookie"
], function (Controller, JSONModel, Cookie) {
	"use strict";

	return Controller.extend("rab.controller.Root", {
		onInit: function () {
			// anmeldung beim laden seite löschen
			// Cookie.eraseCookie("kunde");
			let c = Cookie.getCookie("kunde");
			if (c) {				
				let oComponent = this.getOwnerComponent();
				let m = oComponent.getModel("user");
				m.setProperty("/EMail", JSON.parse(c).EMail);
			}

			let oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("Root", "login", this.pruefeLogin, this);
			oEventBus.subscribe("Root", "navToHome", this.onHeaderPressed, this);
			oEventBus.subscribe("Root", "navToDetail", function () {
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("details");
			}, this);


			this.pruefeLogin();
		},
		onExit: function () {
			let oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.unsubscribe("Root", "login", this.pruefeLogin, this);
		},
		pruefeLogin: function () {
			console.log("pruefeLogin");
			let c = Cookie.getCookie("kunde");
			let eingeloggt = false;
			if (c) {
				eingeloggt = true;
			}
			let btnUser = this.byId("btnUser");
			btnUser.setVisible(eingeloggt);
			let btnLogin = this.byId("btnLogin");
			btnLogin.setVisible(!eingeloggt);
			let btnRegister = this.byId("btnRegister");
			btnRegister.setVisible(!eingeloggt);
			let oEventbus = sap.ui.getCore().getEventBus();
		},
		onHeaderPressed: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("");
		},
		onLogin: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");
		},
		onRegister: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("register");
		},
		onKundendetail: function (oEvent) {
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("rab.fragment.Popover", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		onLogout: function (oEvent) {
			this._oPopover.close();
			let oComponent = this.getOwnerComponent();
			let m = oComponent.getModel("user");
			m.setProperty("/EMail", "");
			Cookie.eraseCookie("kunde");
			this.pruefeLogin();
			this.onHeaderPressed();
		},
		onDetails: function (oEvent) {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("kundenDetail");
		},
		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		}
	});
});