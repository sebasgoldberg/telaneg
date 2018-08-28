import BaseTablePopover from "simplifique/telaneg/controller/BaseTablePopover";

export default BaseTablePopover.extend("simplifique.telaneg.controller.StockPopover",{


    getPopoverFragmentName: function() {
        return "simplifique.telaneg.view.VendasPopover";
    },

    getAggregationPath: function() {
        return 'venda';
    },

    getObjectToBeAdded: function() {
        return {
            De: this.getView().byId('vendaDeDatePicker').getDateValue(),
            Ate: this.getView().byId('vendaAteDatePicker').getDateValue(),
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

