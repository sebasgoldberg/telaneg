import ManagedObject from "sap/ui/base/ManagedObject";

export default ManagedObject.extend("cp.simplifique.telaneg.controller.ImpostosPopover",{


    constructor : function (oView) {
        this._oView = oView;    
    },

    exit : function () {
        delete this._oView;
    },

    open : function (sPath, oOpenBy) {
        if (!this.popoverImpostos){
            this.popoverImpostos = sap.ui.xmlfragment("cp.simplifique.telaneg.view.Impostos", this);
            this._oView.addDependent(this.popoverImpostos);
        }

        this.popoverImpostos.bindObject(sPath);

        if (this.popoverImpostos.isOpen())
            this.popoverImpostos.close()
        else{
            this.popoverImpostos.openBy(oOpenBy);
        }

    },

    onFecharPopoverImpostos: function() {
        this.popoverImpostos.close();
    },

});
