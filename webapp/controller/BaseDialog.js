import ManagedObject from "sap/ui/base/ManagedObject";

export default ManagedObject.extend("simplifique.telaneg.controller.BaseDialog",{

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

    open : function (sPath) {
        if (!this.dialog){
            this.dialog = sap.ui.xmlfragment(this.getView().getId(), this.sFragment, this);
            this._oView.addDependent(this.dialog);
        }

        this.dialog.bindObject(sPath);

        if (this.dialog.isOpen())
            this.dialog.close()
        else
            this.dialog.open();
    },

    onFechar: function() {
        this.dialog.close();
    },

});


