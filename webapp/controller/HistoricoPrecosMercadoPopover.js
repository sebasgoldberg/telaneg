import BasePopover from "simplifique/telaneg/base/controller/BaseTablePopover";

export default BasePopover.extend("simplifique.telaneg.base.controller.HistoricoPrecosMercadoPopover",{

    getPopoverFragmentName: function() {
        return "simplifique.telaneg.base.view.HistoricoPrecosMercadoPopover";
    },

    getAggregationPath: function() {
        return 'precosMercado';
    },

    getTable: function() {
        let v = this.getView();
        return v.byId('historicoPrecosMercadoTable');
    },

});


