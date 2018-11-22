import BaseTablePopover from "simplifique/telaneg/base/controller/BaseTablePopover";

export default BaseTablePopover.extend("simplifique.telaneg.base.controller.VendasPopover",{

    getPopoverFragmentName: function() {
        return "simplifique.telaneg.base.view.VendasPopover";
    },

    getAggregationPath: function() {
        return 'venda';
    },

    getObjectToBeAdded: function() {
        let oDateRangeSelection = this.getView().byId('vendaDateRangeSelection');
        return {
            De: oDateRangeSelection.getDateValue(),
            Ate: oDateRangeSelection.getSecondDateValue(),
            }
    },

    getTable: function() {
        let v = this.getView();
        return v.byId('vendaTable');
    },

    getAddPopover: function() {
        return this.getView().byId('popoverObterVenda');
    },

});

