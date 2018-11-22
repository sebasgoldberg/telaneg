import BaseSelectFacetDialog from "simplifique/telaneg/base/controller/BaseSelectFacetDialog";

export default BaseSelectFacetDialog.extend("simplifique.telaneg.base.controller.SelecaoGrupoLojasDialog",{

    constructor : function (oView) {
        BaseSelectFacetDialog.prototype.constructor.call(this,
            oView, "simplifique.telaneg.base.view.SelecaoGrupoLojasDialog");
    },

    getSearchFieldName: function() {
        return 'Nome';
    },

    getListID: function() {
        return 'gruposList';
    },

    getFacetFilterID: function() {
        return 'facetFilterGrupos';
    },

    getSearchFieldID: function(){
        return 'searchFieldGrupoLojas';
    },

});


