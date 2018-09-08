import BaseSelectDialog from "simplifique/telaneg/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("simplifique.telaneg.controller.SelecaoMaterialFornecedorDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.SelecaoMaterialFornecedorDialog");
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        let aFilters = [];
        if (sValue) {
            if (/^\d+$/.test(sValue))
                aFilters.push(new Filter("ID", FilterOperator.EQ, sValue))
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, sValue));
        }
        return aFilters;
    },

});


