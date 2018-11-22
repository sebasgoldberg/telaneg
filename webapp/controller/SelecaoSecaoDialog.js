import BaseSelectDialog from "simplifique/telaneg/base/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("simplifique.telaneg.base.controller.SelecaoSecaoDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.base.view.SelecaoSecaoDialog");
    },

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        return "selecaoSecaoDialog";
    },

    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        let aFilters = [];
        if (sValue) {
            if ((sValue.length == 2) && (/^\d+$/.test(sValue)))
                aFilters.push(new Filter("ID", FilterOperator.EQ, sValue))
            else
                aFilters.push(new Filter("Descricao", FilterOperator.Contains, sValue));
        }
        return aFilters;
    },

});





