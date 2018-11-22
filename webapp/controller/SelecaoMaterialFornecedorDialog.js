import BaseSelectDialog from "cp/simplifique/telaneg/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("cp.simplifique.telaneg.controller.SelecaoMaterialFornecedorDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "cp.simplifique.telaneg.view.SelecaoMaterialFornecedorDialog");
    },

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        return "materiaisFornecedorSelectDialog";
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        let aFilters = [];
        if (sValue) {
            if (/^[\d\s]+$/.test(sValue))
                aFilters.push(new Filter("ID", FilterOperator.Contains, sValue.replace(/\s/g,"").replace(/^0*/g,"")));
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, sValue));
        }
        return aFilters;
    },

});


