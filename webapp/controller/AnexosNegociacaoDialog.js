import AnexosBaseDialog from "simplifique/telaneg/controller/AnexosBaseDialog";

export default AnexosBaseDialog.extend("simplifique.telaneg.controller.AnexosNegociacaoDialog",{

    constructor : function (oView) {
        AnexosBaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.AnexosNegociacao", "anexos", "UploadCollectionNegociacao");
    },

});

