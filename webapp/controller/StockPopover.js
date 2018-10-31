import BasePopover from "simplifique/telaneg/controller/BaseTablePopover";

export default BasePopover.extend("simplifique.telaneg.controller.StockPopover",{

    getPopoverFragmentName: function() {
        return "simplifique.telaneg.view.StockPopover";
    },

    getAggregationPath: function() {
        return 'stock';
    },

    getObjectToBeAdded: function() {
        return {
            Data: this.getView().byId('stockDatePicker').getDateValue(),
            }
    },

    getTable: function() {
        let v = this.getView();
        return v.byId('stockTable');
    },

    getAddPopover: function() {
        return this.getView().byId('popoverObterStock');
    },

});

