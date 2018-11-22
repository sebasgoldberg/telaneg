import BaseSelectDialog from "cp/simplifique/telaneg/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("cp.simplifique.telaneg.controller.SelecaoFornecedorDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "cp.simplifique.telaneg.view.SelecaoFornecedorDialog");
    },

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        return "selecaoFornecedorDialog";
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        let aFilters = [];
        if (sValue) {
            if (sValue.length == 10)
                aFilters.push(new Filter("ID", FilterOperator.EQ, sValue))
            else if (/^\d+$/.test(sValue))
                aFilters.push(new Filter("ID", FilterOperator.Contains, sValue))
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, sValue));
        }
        return aFilters;
    },

});



