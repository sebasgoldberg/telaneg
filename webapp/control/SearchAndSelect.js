import Control from "sap/ui/core/Control";
import List from "sap/m/List";
import Toolbar from "sap/m/Toolbar";
import SearchField from "sap/m/SearchField";
import Page from "sap/m/Page";
import Filter from "sap/ui/model/Filter";
import Label from "sap/m/Label";
import ListMode from "sap/m/ListMode";

export default Control.extend("simplifique.telaneg.control.SearchAndSelect", {

    metadata : {
        properties: {
            filterFields: 'string',
            quanSelText: 'string',
            },
        defaultAggregation : "items",
        aggregations: {
            items: {
                type: "sap.m.ListItemBase",
                multiple: true,
                forwarding: {
                    getter: '_getList',
                    aggregation: 'items',
                    forwardBinding: true,
                    },
                },
            _toolbar: {
                type: "sap.m.Toolbar",
                multiple: false,
                visibility: 'hidden',
                },
            _list: {
                type: 'sap.m.List',
                multiple: false,
                visibility: 'hidden'
                },
            },
    },

    setQuanSelText: function(sValue){
        this.setProperty("quanSelText", sValue, true);
        this.updateSelectedQuantity();
        },

    getSelectedContexts: function(){
        if (this.list)
            return this.list.getSelectedContexts(true);
        return [];
    },

    _getList: function() {
        return this.list;
    },

    getFilters: function(sQuery) {
        return this.getFilterFields().split(',')
            .map( sField => new Filter(sField.trim(), sap.ui.model.FilterOperator.Contains, sQuery) );
    },

    getOrFilter: function(sQuery){
        return new Filter({
            filters: this.getFilters(sQuery),
            and: false,
            });
    },

    getToolbarLabel: function(){
        return this.toolbarLabel;
    },

    getSelectedQuantityText:function(){
        return `${this.getQuanSelText()}: ${this.getSelectedContexts().length}`
        },

    updateSelectedQuantity: function() {
        this.getToolbarLabel().setText(this.getSelectedQuantityText());
    },

    init : function (...args) {
        Control.prototype.init.apply(this, ...args)
        let oSearchField = new SearchField({
            search: function(oEvt){
                let sQuery = oEvt.getSource().getValue();
                let aFilters = [ this.getOrFilter(sQuery) ];
                let binding = this.getBinding("items");
                binding.filter(aFilters, sap.ui.model.FilterType.Application);

                }.bind(this),
            })
        let oToolbar = new Toolbar({ content: oSearchField });
        this.setAggregation('_toolbar', oToolbar)

        this.toolbarLabel = new Label({
            text: this.getSelectedQuantityText(),
            });

        this.list = new List({
            infoToolbar: new Toolbar({
                content: this.toolbarLabel,
                }),
            mode: ListMode.MultiSelect,
            selectionChange: function(oEvt){
                this.updateSelectedQuantity();
                }.bind(this),
            growing: true,
            growingThreshold: 15,
            growingScrollToLoad: true,
            });
        this.setAggregation('_list', this.list)
    },

    renderer : function (oRenderManager, oControl){
        oRenderManager.write("<div"); 
        oRenderManager.writeControlData(oControl);
        oRenderManager.writeClasses();
        oRenderManager.write(">");
        oRenderManager.renderControl(oControl.getAggregation("_toolbar"));
        oRenderManager.renderControl(oControl.getAggregation("_list"));
        oRenderManager.write("</div>");
    }

});
