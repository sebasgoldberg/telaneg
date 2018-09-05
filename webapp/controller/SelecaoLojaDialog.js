import ManagedObject from "sap/ui/base/ManagedObject";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default ManagedObject.extend("simplifique.telaneg.controller.SelecaoLojaDialog",{

    constructor : function (oView) {
        this._oView = oView;    
    },

    exit : function () {
        delete this._oView;
    },

    getView: function() {
        return this._oView;
    },

    open : function (sPath) {
        return new Promise( (resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            if (!this.dialog){
                this.dialog = sap.ui.xmlfragment(this.getView().getId(), "simplifique.telaneg.view.SelecaoLojaDialog", this);
                this._oView.addDependent(this.dialog);
            }

            this.dialog.bindObject(sPath);

            if (this.dialog.isOpen())
                this.dialog.close()
            else{
                this.getListControl().removeSelections(true);
                this.dialog.open();
            }
        });
    },

    getListControl: function(){
        return this._oView.byId(this.getListID());
    },

    onSelecionar: function() {
        this.dialog.close();
        this.resolve(this.getListControl());
    },

    onFechar: function() {
        this.dialog.close();
        this.reject();
    },

    _applyFilter: function(oFilter) {
        let oListLojas = this.getListControl();
        oListLojas.getBinding("items").filter(oFilter);
    },

    getTipoAbrangencia: function() {
        return this.dialog.getBindingContext().getProperty('TipoAbrangencia');
    },

    getSearchFieldName: function() {
        let sTipoAbrangencia = this.getTipoAbrangencia();
        switch (sTipoAbrangencia){
            case 'L':
                return 'ID';
            case 'G':
                return 'Nome';
            case 'R':
                return 'ID';
            case 'U':
                return 'ID';
        }
    },

    getListID: function() {
        let sTipoAbrangencia = this.getTipoAbrangencia();
        switch (sTipoAbrangencia){
            case 'L':
                return 'lojasList';
            case 'G':
                return 'gruposList';
            case 'R':
                return 'centrosReferenciaList';
            case 'U':
                return 'ufsList';
        }
    },

    getFacetFilterID: function() {
        let sTipoAbrangencia = this.getTipoAbrangencia();
        switch (sTipoAbrangencia){
            case 'L':
                return 'facetFilterLojas';
            case 'G':
                return 'facetFilterGrupos';
        }
    },

    onFilterConfirm: function(oEvent) {

        let aFilters = [];

        let oSearchField = this.getView().byId('searchFieldItemOrg');
        let sQuery = oSearchField.getValue();
        if (sQuery)
            aFilters.push(new Filter(this.getSearchFieldName(), FilterOperator.Contains, sQuery));

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

});

