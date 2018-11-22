import BaseSelectFacetDialog from "cp/simplifique/telaneg/controller/BaseSelectFacetDialog";

export default BaseSelectFacetDialog.extend("cp.simplifique.telaneg.controller.SelecaoLojaDialog",{

    constructor : function (oView) {
        BaseSelectFacetDialog.prototype.constructor.call(this,
            oView, "cp.simplifique.telaneg.view.SelecaoLojaDialog");
    },

    getSearchFieldName: function() {
        return 'ID';
    },

    getListID: function() {
        return 'lojasList';
    },

    getFacetFilterID: function() {
        return 'facetFilterLojas';
    },

    getSearchFieldID: function(){
        return 'searchFieldItemOrg';
    },

});

