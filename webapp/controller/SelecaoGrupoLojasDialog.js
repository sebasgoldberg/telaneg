import BaseSelectFacetDialog from "cp/simplifique/telaneg/controller/BaseSelectFacetDialog";

export default BaseSelectFacetDialog.extend("cp.simplifique.telaneg.controller.SelecaoGrupoLojasDialog",{

    constructor : function (oView) {
        BaseSelectFacetDialog.prototype.constructor.call(this,
            oView, "cp.simplifique.telaneg.view.SelecaoGrupoLojasDialog");
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


