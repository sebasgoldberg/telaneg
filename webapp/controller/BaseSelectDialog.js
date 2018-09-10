import BaseDialog from "simplifique/telaneg/controller/BaseDialog";

export default BaseDialog.extend("simplifique.telaneg.controller.BaseSelectDialog",{

    onSelecionar: function(oEvent) {
        this.resolve(oEvent.getParameters().selectedContexts);
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        return [];
    },

    onSearch: function(oEvent) {
        let oParams = oEvent.getParameters();
        let aFilters = this.createFilters(oParams.value);
        oParams.itemsBinding.filter(aFilters);
    },

    onFechar: function() {
        this.resolve([]);
    },


});



