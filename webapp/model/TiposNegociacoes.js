import ManagedObject from "sap/ui/base/ManagedObject";
import formatter from "simplifique/telaneg/model/formatter";

let aIDsControlesAdaptaveis = [
    "UMVColumn",
    "precoVendaColumn",
    "PMZColumn",
    "margemPDVColumn",
    "recomposicaoColumn",
    "margem2SimuladaColumn",
    "menorPrecoMercadoColumn",
    "indiceCompetitividadeColumn",
    "UMBColumn",
    "custoBrutoColumn",
    "custoLiquidoColumn",
    "recomposicaoColumn",
    "fornecedoresAdicionaisTable",
    "fornecedoresAdicionaisSubSection",
    ];


class TipoNegociacao{

    constructor(aIDsControlesVisiveis){
        this.aIDsControlesVisiveis = aIDsControlesVisiveis;
        this.oView = undefined;
    }

    setView(oView){
        this.oView = oView;
    }

    adaptarView(){
        aIDsControlesAdaptaveis
        .forEach( sIDControle => 
            this.oView.byId(sIDControle).setVisible(
                this.aIDsControlesVisiveis.indexOf(sIDControle) >= 0)
            );
    }
}

export default ManagedObject.extend("simplifique.telaneg.model.TiposNegociacoes",{

    formatter: formatter,

    constructor : function (oView) {
        this.oView = oView;
        this.oTiposNegociacao = {
            O: new TipoNegociacao(
                [
                    "UMVColumn",
                    "precoVendaColumn",
                    "PMZColumn",
                    "margemPDVColumn",
                    "recomposicaoColumn",
                    "margem2SimuladaColumn",
                    "menorPrecoMercadoColumn",
                    "indiceCompetitividadeColumn"
                    ]
                ),
            I: new TipoNegociacao(
                [
                    "UMBColumn",
                    "custoBrutoColumn",
                    "custoLiquidoColumn",
                    "recomposicaoColumn",
                    "fornecedoresAdicionaisTable",
                    "fornecedoresAdicionaisSubSection",
                    ]
                ),
            };
    },

    getTipoNegociacao: function(oNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[oNegociacao.TipoNegociacao];
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


