import BaseDialog from "simplifique/telaneg/controller/BaseDialog";
import UploadCollectionParameter from "sap/m/UploadCollectionParameter";

export default BaseDialog.extend("simplifique.telaneg.controller.AnexosNegociacaoDialog",{

    formatter: {
        urlAnexoForDownload: function(sItem) {
            let sPath = this.getBindingContext().getPath();
            return this.getOwnerComponent().getUrlContent(`${sPath}/anexos('${sItem}')`);
        },
    },

    constructor : function (oView) {
        BaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.AnexosNegociacao");
    },

    open: function(sPath, ...args) {
        BaseDialog.prototype.open.call(this, sPath, ...args);
        let sUploadUrl = this.getOwnerComponent().getUploadUrl(`${sPath}/anexos`);
        this.getUploadCollection().setUploadUrl(sUploadUrl)
    },

    getUploadCollection: function() {
        return this.getView().byId('UploadCollection');
    },

    onBeforeUploadStarts: function(oEvent) {

        this.getUploadCollection().setBusy(true);

        let oParams = oEvent.getParameters();

        let sCsrfToken = this.getView().getModel().getHeaders()['x-csrf-token'];
        let oCustomerHeaderToken = new UploadCollectionParameter({
            name: "x-csrf-token",
            value: sCsrfToken
        });
        oParams.addHeaderParameter(oCustomerHeaderToken);

        let oCustomerHeaderFileName = new UploadCollectionParameter({
            name: "filename",
            value: oParams.fileName
        });
        oParams.addHeaderParameter(oCustomerHeaderFileName);

    },

    refreshItems: function() {
        this.getUploadCollection().getBinding('items').refresh();
    },

    onUploadComplete: function(attribute) {
        this.refreshItems();
        this.getUploadCollection().setBusy(false);
    },

    urlForDownload: function(oItem) {
        return oItem;
    },

    onFileDeleted: async function(oEvent) {
        let oUploadCollectionItem = oEvent.getParameters().item;
        let sAnexoPath = oUploadCollectionItem.getBindingContext().getPath();
        try {
            this.getUploadCollection().setBusy(true);
            let sNegociacaoID = this.getBindingContext().getObject().ID;
            await(this.remove(sAnexoPath, {'NegociacaoID': sNegociacaoID}));
            this.refreshItems();
        } catch (e) {
            this.getOwnerComponent().error(e);
        } finally {
            this.getUploadCollection().setBusy(false);
        }
    },

});

