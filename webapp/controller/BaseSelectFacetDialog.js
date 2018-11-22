import BaseDialog from "simplifique/telaneg/controller/BaseDialog";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default BaseDialog.extend("simplifique.telaneg.controller.BaseSelectFacetDialog",{

    /**
     * @return string O nome do campo OData para filtrar o texto
     * ingressado no campo Search.
     */
    getSearchFieldName: function() {
        throw "O método getSearchFieldName não foi redefinido."
    },

    /**
     * @return string O ID da lista que contem os valores a selecionar.
     */
    getListID: function() {
        throw "O método getListID não foi redefinido."
    },

    /**
     * @return string O ID do facet filter.
     */
    getFacetFilterID: function() {
        throw "O método getFacetFilterID não foi redefinido."
    },

    /**
     * @return string O ID do controle Search.
     */
    getSearchFieldID: function(){
        throw "O método getSearchFieldID não foi redefinido."
    },

    /**
     * @return Filter[] Os filtros criados a partir do valor do controle Search.
     */
    createSearchFilters: function(sQuery) {
        let aFilters = [];

        if (sQuery)
            aFilters.push(new Filter(this.getSearchFieldName(), FilterOperator.Contains, sQuery));
        
        return aFilters;
    },

    getListControl: function(){
        return this._oView.byId(this.getListID());
    },

    onSelecionar: function() {
        this.dialog.close();
        this.resolve(this.getListControl().getSelectedContexts());
    },

    _applyFilter: function(oFilter) {
        let oList = this.getListControl();
        oList.getBinding("items").filter(oFilter);
    },

    onFilterConfirm: function(oEvent) {

        let aFilters = [];

        let oSearchField = this.getView().byId(this.getSearchFieldID());
        let sQuery = oSearchField.getValue();

        this.createSearchFilters(sQuery).forEach( oFilter => aFilters.push(oFilter) );

        if (this.getFacetFilterID()){
            let oFacetFilter = this.getView().byId(this.getFacetFilterID());

            let mFacetFilterLists = oFacetFilter.getLists().filter(function(oList) {
                return oList.getSelectedItems().length;
            });

            mFacetFilterLists.forEach( oList => 
                oList.getSelectedItems().forEach(
                    oItem => aFilters.push(new Filter(oList.getKey(), FilterOperator.EQ, oItem.getKey()))
                    )
            );
        }

        this._applyFilter(aFilters);

    },

    onFilterReset: function(oEvent) {

        let oFacetFilter = this.getView().byId(this.getFacetFilterID());

        oFacetFilter.getLists().forEach( oList => {
            oList.removeSelections(true);
            oList.getBinding("items").filter([]);
        });

        this._applyFilter([]);
    },

    onFechar: function() {
        this.dialog.close();
        this.resolve([]);
    },

});


