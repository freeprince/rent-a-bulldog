sap.ui.define("rab/control/SelectButton",[
    "sap/ui/core/Control",
    "sap/m/Button",
    "sap/m/CheckBox",
    "sap/m/Text",
    "rab/control/SelectButtonCheckBox"
], function(Control, Button, CheckBox, Text, SelectButtonCheckBox) {
    "use strict";

    // TODO
    // https://www.nabisoft.com/tutorials/sapui5/creating-custom-controls-in-sapui5

    // https://github.com/lemaiwo/CustomControlAggregation/tree/master/webapp/control

    var SelectButton = Control.extend("rab.control.SelectButton", {
        
        // the control API:
        metadata : {
            properties : {
                /* Business Object properties */
                description       : {type : "string"},
                myArray           : {type : "object", defaultValue: []},                
                items             : {type : "rab.control.SelectButtonCheckBox", multiple : true, singularName: "item"},                
                                
                /* other (configuration) properties */
                width             : {type : "sap.ui.core.CSSSize", defaultValue : "180px"},
                height            : {type : "sap.ui.core.CSSSize", defaultValue : "50px"}
            },
                            
            aggregations : {
                _label            : {type : "sap.m.Button", multiple : false, visibility: "hidden"},
                _button           : {type : "sap.m.Button", multiple: false, visibility : "hidden"}
            },
                            
            events : {
                press : {
                    enablePreventDefault: true,
                    parameters : {
						value : {type : "object"}
                    }
                },
                onSelectionChange   : {
                    enablePreventDefault : true
                },
                onSelectionFinished : {
                    enablePreventDefault : true,
                    parameters : {
						value : {type : "object"}
                    }
                }
            }
        },
 
        // be careful with this, better avoid it!
        // See why at https://www.nabisoft.com/tutorials/sapui5/why-initializing-properties-on-prototypes-can-have-nasty-side-effects-in-sapui5
        //_oLink : null,
 
        init : function(){
            let oControl = this;
            
            // aufklapp button
            let lbl = new sap.m.Button({
                design: "Bold",
                press: oControl._onPress.bind(oControl)
            });
            lbl.addStyleClass("selectButtonLabel");
            this.setAggregation("_label", lbl);

            // list checkboxen
            // siehe renderer, liste von herstellern ist hier noch nicht gefuellt

            // bestaetigungs button
            let btn = new sap.m.Button({
                text: "Auswählen",
                design: "Bold",
                press: oControl._onConfirm.bind(oControl)
            });
            btn.addStyleClass("selectButtonConfirm");
            this.setAggregation("_button", btn);

            console.log("SelectButton#init");
        },
                        
        onBeforeRendering: function (){      
            let desc = this.getDescription();    
            console.log("onBeforeRendering", desc);
        },
                        
        onAfterRendering: function (){            
            let desc = this.getDescription();    
            console.log("onAfterRendering", desc);  
            
            let nameList = "#selectButtonList-" + desc;

            let items = this.getModel("filter");
            let selected = items.getData()[desc];

            if (selected.length == 0) {
                selected.push("Alle Anzeigen");
            }

            items = $(nameList).find("li");
            $.each(items, function(index, element) {                
                let item = $(element);
                let oText = item.find("div.selectButtonCheckBoxText");
                let sText = oText.text();
                if (selected.includes(sText))  {                    
                    let input = item.find("input");
                    input.attr("checked", true);
                    let div = item.find("div.selectButtonCheckBox");
                    div.attr("aria-checked", true);
                    let bg = item.find("div.sapMCbBg");
                    bg.addClass("sapMCbMarkChecked");
                }
            });
            
            let cbItems = this.getItems();                
            for(let pos in cbItems) {                    
                let item = cbItems[pos];
                let sText = item.getData().Name;
                if (selected.includes(sText))  {    
                    item.setSelected(false);
                }
            }
        },

        exit: function() {                
            let desc = this.getDescription();    
            console.log("exit", desc);
        },
 
        _onPress: function(oEvent) {
            console.log("filter press");
            
            let desc = this.getDescription();
            let nameList = "#selectButtonList-" + desc;
            let nameBtn = ".selectButtonConfirm-" + desc  

            let nameDyn = ".selectButtonDyn-" + desc;
            let classShadow = "selectButtonDyn-shadow";

            if (!$(nameList).is(':visible')) {
                // show  
                console.log("show");        
                $(nameList).show();      
                $(nameBtn).show();                
                $(nameDyn).addClass(classShadow);

            } else {
                // hide
                console.log("hide");
                $(nameList).hide();
                $(nameBtn).hide();
                $(nameDyn).removeClass(classShadow);
            }
        },

        _onConfirm: function(oEvent) {
            console.log("SelectButton._onConfirm:", oEvent);

            let desc = this.getDescription();
            let nameList = "#selectButtonList-" + desc;
            let nameBtn = ".selectButtonConfirm-" + desc

            // hide
            $(nameList).hide();
            $(nameBtn).hide();

            let selected = [];

            let items = $(nameList).find("li");
            $.each(items, function(index, element) {                
                let item = $(element);
                let oText = item.find("div.selectButtonCheckBoxText");
                let sText = oText.text();
                if (sText != "Alle Anzeigen")  {                    
                    let bSelected = item.find("input").prop("checked");
                    if (bSelected) {
                        selected.push(sText);
                    }
                }
            });

			this.fireEvent("onSelectionFinished", {
				value: selected
            });
            
        },

        _onCheckBoxChange: function(oEvent) {
            console.log("SelectButton._onCheckBoxChange:", oEvent);
            let bChecked = oEvent.getParameter("checked");      
            if (bChecked) {                
                // nur "Alle Anzeigen" deselektieren                
                let doCheck = (sText) => sText == "Alle Anzeigen";
                // this._uncheckAll(doCheck);
                
                let desc = this.getDescription();
                let nameList = "#selectButtonList-" + desc;                
                
                let items = $(nameList).find("li");
                $.each(items, function(index, element) {                
                    let item = $(element);
                    let oText = item.find("div.selectButtonCheckBoxText");
                    let sText = oText.text();
                    if (doCheck(sText))  {                    
                        let input = item.find("input");
                        input.attr("checked", false);
                        let div = item.find("div.selectButtonCheckBox");
                        div.attr("aria-checked", false);
                        let bg = item.find("div.sapMCbBg");
                        bg.removeClass("sapMCbMarkChecked");
                    }
                });
                
            }
        },

        _onCheckBoxAllChange: function(oEvent) {
            let bChecked = oEvent.getParameter("checked");         
            if (bChecked) {
                // alle deselektieren

                let doCheck = (sText) => sText != "Alle Anzeigen";
                // this._uncheckAll(doCheck);
                
                let desc = this.getDescription();
                let nameList = "#selectButtonList-" + desc;                
                
                let items = $(nameList).find("li");
                $.each(items, function(index, element) {                
                    let item = $(element);
                    let oText = item.find("div.selectButtonCheckBoxText");
                    let sText = oText.text();
                    if (doCheck(sText))  {                    
                        let input = item.find("input");
                        input.attr("checked", false);
                        let div = item.find("div.selectButtonCheckBox");
                        div.attr("aria-checked", false);
                        let bg = item.find("div.sapMCbBg");
                        bg.removeClass("sapMCbMarkChecked");
                    }
                });
                
                let cbItems = this.getItems();                
                for(let pos in cbItems) {                    
                    cbItems[pos].setSelected(false);
                }

            }
        },

        _uncheckAll: function(doCheck) {
            
                let desc = this.getDescription();
                let nameList = "#selectButtonList-" + desc;                
                
                let items = $(nameList).find("li");
                $.each(items, function(index, element) {                
                    let item = $(element);
                    let oText = item.find("div.selectButtonCheckBoxText");
                    let sText = oText.text();
                    if (doCheck(sText))  {                    
                        let input = item.find("input");
                        input.attr("checked", false);
                        let div = item.find("div.selectButtonCheckBox");
                        div.attr("aria-checked", false);
                        let bg = item.find("div.sapMCbBg");
                        bg.removeClass("sapMCbMarkChecked");
                    }
                });
                
        },

        renderer : {
 
            render : function(oRm, oControl) {
 
                let desc = oControl.getDescription();
                let name = "selectButtonList-" + desc;
                
                oRm.write("<div");
                oRm.writeControlData(oControl);
 
                oRm.addClass("selectButton");
                oRm.writeClasses();
                                
                oRm.addStyle("width", oControl.getWidth());
                oRm.addStyle("height", oControl.getHeight());
                oRm.writeStyles();
 
                oRm.write(">");

                oRm.write("<div");
                oRm.addClass("selectButtonDyn");
                oRm.addClass("selectButtonDyn-" + desc);
                oRm.writeClasses();
                oRm.write(">");
                    
                    let lbl = oControl.getAggregation("_label");                    
                    lbl.setText(desc);
                    oRm.renderControl(lbl);

                    oRm.write("<ul id=\"" + name + "\"");
                    oRm.addClass("selectButtonList");
                    oRm.writeClasses();
                    oRm.write(">");                    
                                    
                        let items = [];

                        let obj = {
                            Name: "Alle Anzeigen"
                        };
                        let oItem = new rab.control.SelectButtonCheckBox({
                            data: obj,
                            checkedChange: oControl._onCheckBoxAllChange.bind(oControl)
                        });
                        oRm.renderControl(oItem);
                        items.push(oItem);

                        let oItems = oControl.getMyArray();
                        for (let index = 0 ; index < oItems.length ; index++)  {
                            obj = oItems[index];
                            oItem = new rab.control.SelectButtonCheckBox({
                                data: obj,
                                checkedChange: oControl._onCheckBoxChange.bind(oControl)
                            });
                            oRm.renderControl(oItem);
                            items.push(oItem);
                        }
                        oControl.setProperty("items", items, true);

                    oRm.write("</ul>");
                    let btn = oControl.getAggregation("_button");
                    btn.addStyleClass("selectButtonConfirm-" + desc);
                    oRm.renderControl(btn);
                oRm.write("</div>");

                oRm.write("</div>");
            }
        }
    });
       
    return SelectButton;
 
});