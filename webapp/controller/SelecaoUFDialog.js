import BaseSelectDialog from "simplifique/telaneg/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("simplifique.telaneg.controller.SelecaoUFDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.SelecaoUFDialog");
    },

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        return "selecaoUFDialog";
    },


    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sValue) {
        let aFilters = [];
        if (sValue)
            aFilters.push(new Filter("ID", FilterOperator.Contains, sValue))
        return aFilters;
    },

});



