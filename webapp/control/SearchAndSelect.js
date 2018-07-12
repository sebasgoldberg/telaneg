import Control from "sap/ui/core/Control";
import List from "sap/m/List";
import Toolbar from "sap/m/Toolbar";
import SearchField from "sap/m/SearchField";
import Page from "sap/m/Page";
import Filter from "sap/ui/model/Filter";
import Label from "sap/m/Label";
import ListMode from "sap/m/ListMode";
import ListRenderer from "sap/m/ListRenderer";

export default List.extend("simplifique.telaneg.control.SearchAndSelect", {

    metadata : {
        properties: {
            filterFields: 'string',
            quanSelText: 'string',
            },
        aggregations: {
            _toolbar: {
                type: "sap.m.Toolbar",
                multiple: false,
                visibility: 'hidden',
                },
            },
    },

    setQuanSelText: function(sValue){
        this.setProperty("quanSelText", sValue, true);
        this.updateSelectedQuantity();
        },

    getFilterFieldsAndOperators: function(){
        return this.getFilterFields().split(',')
            .map( sField => {
                let [ operator, field ] = sField.split('::');
                if (operator.trim() == 'eq')
                    operator = sap.ui.model.FilterOperator.EQ
                else
                    operator = sap.ui.model.FilterOperator.Contains;
                return [operator, field.trim()];
            });
        },

    getFilters: function(sQuery) {
        return this.getFilterFieldsAndOperators()
            .map( ([ operator, field ]) =>
                new Filter(field, operator, sQuery.trim())
                );
    },

    getAndFilter: function(sQuery){
        return new Filter({
            filters: this.getFilters(sQuery),
            and: true,
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

    getSelectedContexts: function() {
        try {
            return List.prototype.getSelectedContexts.apply(this);
        } catch (e) {
            return [];
        }
    },

    init : function (...args) {
        List.prototype.init.apply(this, ...args)
        let oSearchField = new SearchField({
            search: function(oEvt){
                let sQuery = oEvt.getSource().getValue();
                let aFilters = [ this.getAndFilter(sQuery) ];
                let binding = this.getBinding("items");
                binding.filter(aFilters, sap.ui.model.FilterType.Application);

                }.bind(this),
            })
        let oToolbar = new Toolbar({ content: oSearchField });
        this.setAggregation('_toolbar', oToolbar)

        this.toolbarLabel = new Label({
            text: this.getSelectedQuantityText(),
            });

        this.setInfoToolbar( new Toolbar({
            content: this.toolbarLabel,
            }));
        this.setMode( ListMode.MultiSelect);
        this.attachSelectionChange(function(oEvt){
            this.updateSelectedQuantity();
            }.bind(this)),
        this.setGrowing(true);
        this.setGrowingThreshold(15);
        this.setGrowingScrollToLoad(true);
    },

    renderer : function (oRenderManager, oControl){
        oRenderManager.write("<div"); 
        oRenderManager.writeControlData(oControl);
        oRenderManager.writeClasses();
        oRenderManager.write(">");
        oRenderManager.renderControl(oControl.getAggregation("_toolbar"));
        ListRenderer.render.call(this, oRenderManager, oControl);
        oRenderManager.write("</div>");
    }

});
