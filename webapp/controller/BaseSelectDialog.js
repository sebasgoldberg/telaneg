import BaseDialog from "simplifique/telaneg/base/controller/BaseDialog";

export default BaseDialog.extend("simplifique.telaneg.base.controller.BaseSelectDialog",{

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        throw "Método getSelectDialogID não implementado."
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        return [];
    },

    beforeOpen: function() {
        let oSelectDialog = this.getView().byId(this.getSelectDialogID());
        if (! oSelectDialog)
            return;
        let oBinding = oSelectDialog.getBinding('items');
        oBinding.filter(this.aAditionalFilters);
        // @fixme Por default sempre faz o refresh.
        oBinding.refresh();
    },

    open: function (sPath, aAditionalFilters=[]) {
        this.aAditionalFilters = aAditionalFilters;
        return BaseDialog.prototype.open.call(this, sPath);
    },

    onSelecionar: function(oEvent) {
        this.resolve(oEvent.getParameters().selectedContexts);
    },

    onSearch: function(oEvent) {
        let oParams = oEvent.getParameters();
        let aFilters = this.createFilters(oParams.value);
        aFilters.push(...(this.aAditionalFilters));
        oParams.itemsBinding.filter(aFilters);
    },

    onFechar: function() {
        this.resolve([]);
    },


});



