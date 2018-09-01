import BaseDialog from "simplifique/telaneg/controller/BaseDialog";
import UploadCollectionParameter from "sap/m/UploadCollectionParameter";

export default BaseDialog.extend("simplifique.telaneg.controller.AnexosNegociacaoDialog",{

    constructor : function (oView) {
        BaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.AnexosNegociacao");
    },

    onChange: function(oEvent) {
        let sCsrfToken = this.getView().getModel().getHeaders()['x-csrf-token'];
        let oUploadCollection = oEvent.getSource();
        let oCustomerHeaderToken = new UploadCollectionParameter({
            name: "x-csrf-token",
            value: sCsrfToken
        });
        oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
    },

});

