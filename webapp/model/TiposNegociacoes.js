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
    "clausulaLabel",
    "clausulaInput",
    "clausulaDescricaoInput",
    "anexosNegociacaoButton",
    "anexosEstipulacaoButton",
    "minutaButton",
    ];

let aIDsControlesTaskList = [
    'anexosColumn',
    'estipulacaoColumn',
];

class TipoNegociacao{

    constructor(aIDsControlesVisiveis, aIDsControlesVisiveisTaskList = []){
        this.aIDsControlesVisiveis = aIDsControlesVisiveis;
        this.aIDsControlesVisiveisTaskList = aIDsControlesVisiveisTaskList;
        this.oView = undefined;
    }

    setView(oView){
        this.oView = oView;
    }

    modificarVisibilidade(aTudosOsControles, aControlesVisiveis){
        aTudosOsControles
        .forEach( sIDControle => 
            this.oView.byId(sIDControle).setVisible(
                aControlesVisiveis.indexOf(sIDControle) >= 0)
            );
    }

    adaptarView(){
        this.modificarVisibilidade(aIDsControlesAdaptaveis, this.aIDsControlesVisiveis);
        this.getView().byId("itemsObjectPageSection").setTitle(this.getItemsSectionTitle());
        this.getView().byId("itemsObjectPageSubSection").setTitle(this.getItemsSectionTitle());
    }

    adaptarTaskListView(){
        this.modificarVisibilidade(aIDsControlesTaskList, this.aIDsControlesVisiveisTaskList);
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
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton",
            "minutaButton",
            ],[
            'anexosColumn',
            'estipulacaoColumn',
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
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton",
            "minutaButton",
            ],[
            'anexosColumn',
            'estipulacaoColumn',
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
            "clausulaLabel",
            "clausulaInput",
            "clausulaDescricaoInput",
            "anexosEstipulacaoButton",
            "minutaButton",
            ],[
            'anexosColumn',
            'estipulacaoColumn',
            ]);
    }

    getItemsSectionTitle(){
        return "Bonificação";
    }

}

class TipoNegociacaoPrazoPagto extends TipoNegociacao{

    constructor(){
        super([
            "anexosNegociacaoButton",
            "negociacoesPrazoTable",
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

        //exibir
        this.getView().byId("prazoPagtoObjectPageSection").setVisible(true);
        this.getView().byId("infoGeralPrazPagSubSection").setVisible(true);        
        
        
    }


}

class TipoNegociacaoCustoPontual extends TipoNegociacao{

    constructor(){
        super([
            "periodoApuracaoRangeSelection",
            "periodoApuracaoLabel",
            "anexosNegociacaoButton",
            ]);
    }

    getItemsSectionTitle(){
        return "Mercadorias";
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
            C: new TipoNegociacaoCustoPontual(),
            };
    },

    getTipoNegociacao: function(sTipoNegociacao){
        let oTipoNegociacao = this.oTiposNegociacao[sTipoNegociacao];
        oTipoNegociacao.setView(this.oView);
        return oTipoNegociacao;
    },

});


