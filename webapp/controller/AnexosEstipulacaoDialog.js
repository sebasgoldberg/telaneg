import AnexosBaseDialog from "simplifique/telaneg/controller/AnexosBaseDialog";

export default AnexosBaseDialog.extend("simplifique.telaneg.controller.AnexosEstipulacaoDialog",{

    constructor : function (oView) {
        AnexosBaseDialog.prototype.constructor.call(this, oView,
            "simplifique.telaneg.view.AnexosEstipulacao", "anexosEstipulacao", "UploadCollectionEstipulacao");
    },

});


