import BaseSelectFacetDialog from "simplifique/telaneg/controller/BaseSelectFacetDialog";

export default BaseSelectFacetDialog.extend("simplifique.telaneg.controller.SelecaoLojaDialog",{

    constructor : function (oView) {
        BaseSelectFacetDialog.prototype.constructor.call(this,
            oView, "simplifique.telaneg.view.SelecaoLojaDialog");
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

