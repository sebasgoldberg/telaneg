import AnexosBaseDialog from "simplifique/telaneg/base/controller/AnexosBaseDialog";

export default AnexosBaseDialog.extend("simplifique.telaneg.base.controller.AnexosNegociacaoDialog",{

    constructor : function (oView) {
        AnexosBaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.base.view.AnexosNegociacao", "anexos", "UploadCollectionNegociacao");
    },

});

