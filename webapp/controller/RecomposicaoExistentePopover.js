import BasePopover from "simplifique/telaneg/base/controller/BaseTablePopover";

export default BasePopover.extend("simplifique.telaneg.base.controller.RecomposicaoExistentePopover",{

    getPopoverFragmentName: function() {
        return "simplifique.telaneg.base.view.RecomposicaoExistentePopover";
    },

    getAggregationPath: function() {
        return 'recomposicaoExistente';
    },

    getObjectToBeAdded: function() {
        return {
            // Data: this.getView().byId('recomposicaoExistenteDatePicker').getDateValue(),
            }
    },

    getTable: function() {
        let v = this.getView();
        return v.byId('recomposicaoExistenteTable');
    },

    getAddPopover: function() {
        return this.getView().byId('popoverObterRecomposicaoExistente');
    },

});

