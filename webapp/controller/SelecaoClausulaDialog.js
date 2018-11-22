import BaseSelectDialog from "cp/simplifique/telaneg/controller/BaseSelectDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseSelectDialog.extend("cp.simplifique.telaneg.controller.SelecaoClausulaDialog",{

    constructor : function (oView) {
        BaseSelectDialog.prototype.constructor.call(this, oView,
            "cp.simplifique.telaneg.view.SelecaoClausulaDialog");
    },

    /**
     * @return string ID do SelectDialog na view.
     */
    getSelectDialogID: function() {
        return "selecaoClausulaDialog";
    },


    /**
     * A ser redefinido pelas clases filhas.
     * @return Filter[]
     */
    createFilters: function(sTerm) {
        let aFilters = [];
        if (sTerm) {
            aFilters.push(new Filter("Descricao", FilterOperator.Contains, sTerm));
            if (sTerm.length < 4)
                aFilters.push(new Filter("ID", FilterOperator.StartsWith, sTerm))
            else if (sTerm.length == 4)
                aFilters.push(new Filter("ID", FilterOperator.EQ, sTerm));
        }
        return aFilters;
    },

});





