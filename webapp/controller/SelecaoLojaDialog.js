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
            else
                this.dialog.open();
        });
    },

    onSelecionar: function() {
        this.dialog.close();
        this.resolve(this._oView.byId('lojasList'));
    },

    onFechar: function() {
        this.dialog.close();
        this.reject();
    },

    _applyFilter: function(oFilter) {
        let oListLojas = this.getView().byId('lojasList');
        oListLojas.getBinding("items").filter(oFilter);
    },

    lojasFilterConfirm: function(oEvent) {

        let oFacetFilter = this.getView().byId('facetFilterLojas');

        var mFacetFilterLists = oFacetFilter.getLists().filter(function(oList) {
            return oList.getSelectedItems().length;
        });

        if (mFacetFilterLists.length) {
            // Build the nested filter with ORs between the values of each group and
            // ANDs between each group
            var oFilter = new Filter(mFacetFilterLists.map(function(oList) {
                return new Filter(oList.getSelectedItems().map(function(oItem) {
                    return new Filter(oList.getKey(), FilterOperator.EQ, oItem.getText());
                }), false);
            }), true);
            this._applyFilter(oFilter);
        } else {
            this._applyFilter([]);
        }

    },


});

