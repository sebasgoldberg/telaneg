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
    "periodoApuracaoRangeSelection",
    "periodoApuracaoLabel",
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
        .forEach( sIDControle => {
            if (this.oView.byId(sIDControle))
            {
                this.oView.byId(sIDControle).setVisible(
                this.aIDsControlesVisiveis.indexOf(sIDControle) >= 0)
            }                   
        });
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
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
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
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
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

class TipoNegociacaoPrazoPagto extends TipoNegociacao{

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
            "infoGeralSubSection",
            "infoGeralPrazPagSubSection", 
            ]);
    }

    getItemsSectionTitle(){
        return "Prazo de Pagamento";
    }

    ocultarSecoes(){
        //ocultar
        this.getView().byId("abrangenciaObjectPageSection").setVisible(false);
        this.getView().byId("contratoObjectPageSection").setVisible(false);
        this.getView().byId("itemsObjectPageSection").setVisible(false);            
        this.getView().byId("infoGeralSubSection").setVisible(false);
        this.getView().byId("statusBox").setVisible(false);
        this.getView().byId("bonificacaoBox").setVisible(false);
        this.getView().byId("anexoButtonId").setVisible(false);
        
        
        

        //exibir
        this.getView().byId("prazoPagtoObjectPageSection").setVisible(true);
        this.getView().byId("infoGeralPrazPagSubSection").setVisible(true);
        this.getView().byId("anexoPrazoButtonId").setVisible(true);
        
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
            P: new TipoNegociacaoPrazoPagto(),
            };
    },

    getTipoNegociacao: function(oNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[oNegociacao.TipoNegociacao];
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


