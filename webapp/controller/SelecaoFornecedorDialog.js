import BaseSelectDialog from "simplifique/telaneg/base/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("simplifique.telaneg.base.controller.SelecaoFornecedorDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.base.view.SelecaoFornecedorDialog");
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
            if ((sValue.length == 14) && (/^\d+$/.test(sValue)))
                aFilters.push(new Filter("CNPJ", FilterOperator.EQ, sValue))
            else if (sValue.length == 10)
                aFilters.push(new Filter("ID", FilterOperator.EQ, sValue))
            else if (/^\d+$/.test(sValue))
                aFilters.push(new Filter("ID", FilterOperator.Contains, sValue))
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, sValue));
        }
        return aFilters;
    },

});



