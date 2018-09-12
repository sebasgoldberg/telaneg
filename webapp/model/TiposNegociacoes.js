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
    "consultasColumn",
    "valorBonificacaoColumn",
    "fornecedoresAdicionaisTable",
    "fornecedoresAdicionaisSubSection",
    "tipoItemMercFormElement",
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
        this.getView().byId("itemsObjectPageSection").setTitle(this.getItemsSectionTitle());
        this.getView().byId("itemsObjectPageSubSection").setTitle(this.getItemsSectionTitle());
    }

    getView(){
        return this.oView;
    }
}

class TipoNegociacaoSellOut extends TipoNegociacao{

    constructor(){
        super([
            "UMVColumn",
            "precoVendaColumn",
            "PMZColumn",
            "margemPDVColumn",
            "recomposicaoColumn",
            "margem2SimuladaColumn",
            "menorPrecoMercadoColumn",
            "indiceCompetitividadeColumn",
            "consultasColumn",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

}


class TipoNegociacaoSellIn extends TipoNegociacao{

    constructor(){
        super([
            "UMBColumn",
            "custoBrutoColumn",
            "custoLiquidoColumn",
            "recomposicaoColumn",
            "fornecedoresAdicionaisTable",
            "fornecedoresAdicionaisSubSection",
            "consultasColumn",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
    }

}


class TipoNegociacaoValorFixo extends TipoNegociacao{

    constructor(){
        super([
            "tipoItemMercFormElement",
            "valorBonificacaoColumn",
            ]);
    }

    getItemsSectionTitle(){
        return "Bonificação";
    }

}

export default ManagedObject.extend("simplifique.telaneg.model.TiposNegociacoes",{

    formatter: formatter,

    constructor : function (oView) {
        this.oView = oView;
        this.oTiposNegociacao = {
            O: new TipoNegociacaoSellOut(),
            I: new TipoNegociacaoSellIn(),
            F: new TipoNegociacaoValorFixo(),
            };
    },

    getTipoNegociacao: function(oNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[oNegociacao.TipoNegociacao];
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


