import BaseTablePopover from "cp/simplifique/telaneg/controller/BaseTablePopover";

export default BaseTablePopover.extend("cp.simplifique.telaneg.controller.VendasPopover",{

    getPopoverFragmentName: function() {
        return "cp.simplifique.telaneg.view.VendasPopover";
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

