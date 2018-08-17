import ManagedObject from "sap/ui/base/ManagedObject";
import Filter from 'sap/ui/model/Filter';
import FilterOperator from 'sap/ui/model/FilterOperator';

export default ManagedObject.extend("simplifique.telaneg.controller.SelecaoMaterialFornecedorDialog",{

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
                this.dialog = sap.ui.xmlfragment(this.getView().getId(), "simplifique.telaneg.view.SelecaoMaterialFornecedorDialog", this);
                this._oView.addDependent(this.dialog);
            }

            this.dialog.bindObject(sPath);

            this.dialog.open();
        });
    },

    onSelecionar: function(oEvent) {
        this.resolve(oEvent.getParameters().selectedContexts);
    },

    onFechar: function() {
        //this.dialog.close();
        this.reject();
    },

    onSearch: function(oEvent) {
        let oParams = oEvent.getParameters();
        let aFilters = [];
        if (oParams.value) {
            if (/^\d+$/.test(oParams.value))
                aFilters.push(new Filter("ID", FilterOperator.EQ, oParams.value))
            else
                aFilters.push(new Filter("Nome", FilterOperator.Contains, oParams.value));
        }
        oParams.itemsBinding.filter(aFilters);

    },

});


