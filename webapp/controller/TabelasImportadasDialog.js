import AnexosBaseDialog from "simplifique/telaneg/base/controller/AnexosBaseDialog";

export default AnexosBaseDialog.extend("simplifique.telaneg.tabela.controller.TabelasImportadasDialog",{

    constructor : function (oView) {
        AnexosBaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.base.view.TabelasImportadas", "tabelasImportadas", "UploadCollectionTabelasImportadas");
    },

    onTabelaImportadaDetails: function(oEvent) {
        let sTabelaImportadaPath = oEvent.getSource().getBindingContext().getPath();
        let tabelaImportadaDialog = this.getOwnerComponent().getTabelaImportadaDialog();
        tabelaImportadaDialog.open(sTabelaImportadaPath);

        //url="{
        //    parts: [ {path: 'Item'} ],
        //    formatter: '.formatter.urlAnexoForDownload'
        //    }"
    },

    onUploadComplete: function() {
        AnexosBaseDialog.prototype.onUploadComplete.apply(this);
        this._callerController.refreshAfterImport();
    },

    setCallerController: function(oController) {
        this._callerController = oController;
    },
});

