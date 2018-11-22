import AnexosBaseDialog from "cp/simplifique/telaneg/controller/AnexosBaseDialog";

export default AnexosBaseDialog.extend("cp.simplifique.telaneg.controller.AnexosNegociacaoDialog",{

    constructor : function (oView) {
        AnexosBaseDialog.prototype.constructor.call(this, oView,
            "cp.simplifique.telaneg.view.AnexosNegociacao", "anexos", "UploadCollectionNegociacao");
    },

});

