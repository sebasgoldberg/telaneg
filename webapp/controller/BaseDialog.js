import ManagedObject from "sap/ui/base/ManagedObject";
import formatter from "simplifique/telaneg/base/model/formatter";

export default ManagedObject.extend("simplifique.telaneg.base.controller.BaseDialog",{

    constructor : function (oView, sFragment) {
        this._oView = oView;
        this.sFragment = sFragment;
    },

    exit : function () {
        delete this._oView;
    },

    getView: function() {
        return this._oView;
    },

    getOwnerComponent: function() {
        return this.getView().getController().getOwnerComponent();
    },

    beforeOpen: function() {
    },

    open : function (sPath) {
        return new Promise( (resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            if (!this.dialog){
                this.dialog = sap.ui.xmlfragment(this.getView().getId(), this.sFragment, this);
                this._oView.addDependent(this.dialog);
            }

            this.dialog.bindObject(sPath);

            this.beforeOpen();

            this.dialog.open();
        });
    },

    onFechar: function() {
        this.dialog.close();
        this.resolve();
    },

    getBindingContext: function(){
        return this.dialog.getBindingContext();
    },

    remove: function(...args){
        return this.getOwnerComponent().remove(...args);
    },

});


